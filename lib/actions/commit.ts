"use server"
import { eq, sql } from "drizzle-orm"
import { db } from "../db"
import { repos } from "../db/schema/repos"
import { Octokit } from "octokit";
import { GoogleGenAI } from "@google/genai";
import { commits as commitsTable } from "../db/schema/commits";
import { commitSummary } from "../db/schema/commitSummary";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
type File = {
    sha: string;
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    patch: string | undefined;
};

type Commit = {
    sha: string;
    commit: {
        author: {
            name: string | undefined;
            email: string | undefined;
            date: string | undefined;
        };
        message: string;
    } | null;
    author: {
        login: string | undefined;
        avatar_url: string | undefined;
    };
    files: File[];
};
type InsertCommit = typeof commitsTable.$inferInsert;
type Docs={
    pageContent:string;
    metadata:{
        repository:string;
        branch:string;
        source:string;
    }
}
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
})
export const pollCommits = async (repoId: string, userId: string) => {
    try {
        const repo = await db.select().from(repos).where(eq(repos.id, repoId));
        if (!repo || repo.length == 0) {
            throw new Error("Repository not found");
        }
        const repoDetails = repo[0];
        if (repoDetails.user_id !== userId) {
            throw new Error("Unauthorized");
        }

        const octokit = new Octokit({
            auth: repoDetails?.personal_access_token || process.env.GITHUB_ACCESS_TOKEN
        })
        const repoUrl = repoDetails.repo_url;
        const owner = repoUrl.replace("https://github.com/", "").split("/")[0];
        const repoName = repoUrl.replace("https://github.com/", "").split("/")[1];

        const commits = await octokit.rest.repos.listCommits({
            owner,
            repo: repoName,
        })
        if (!commits || commits.status !== 200) {
            throw new Error("Error fetching commits");
        }

        //now we will store that commits into the database that are not already present
        const commitList = await db.execute(
            sql` 
                SELECT "commit_hash" FROM commits WHERE "repo_id"=${repoId}
            `
        )
        const commitHashList = commitList.map((commit) => {
            return commit.commit_hash;
        })
        const filteredCommits = commits.data.filter((commit) => {
            return !commitHashList.includes(commit.sha);
        })
        if(filteredCommits.length == 0) {
            return {
                message: "No new commits found",
                success: true,
                data:[],
            }
        }

        //now these filtered commits need to be pushed into database and there summaries are to be generated

        const commitsIndividually = await Promise.all(filteredCommits.map(async (commit) => {
            const commitHash = commit.sha;
            const commitFetched = await octokit.rest.repos.getCommit({
                owner,
                repo: repoName,
                ref: commitHash
            })
            if (!commitFetched || commitFetched.status !== 200) {
                throw new Error("Error fetching commit details");
            }
            const commitDetails = commitFetched.data;
            return {
                sha: commitDetails.sha,
                commit: {
                    author: {
                        name: commitDetails.commit?.author?.name,
                        email: commitDetails.commit?.author?.email,
                        date: commitDetails.commit?.author?.date,
                    },
                    message: commitDetails.commit?.message,
                },
                author: {
                    login: commitDetails.author?.login,
                    avatar_url: commitDetails.author?.avatar_url,
                },
                files: commitDetails?.files?.map((file) => {
                    return {
                        sha: file.sha,
                        filename: file.filename,
                        status: file.status,
                        additions: file.additions,
                        deletions: file.deletions,
                        patch: file.patch,
                    }
                }
                ) || [],
            }
        }));
        // commitsIndividually.forEach((commit)=>{
        //     console.log(commit.files);
        // })

        //generate summary for each commit
        const commitSummaries = await getCommitSummaries(commitsIndividually);

        //save these commitSummaries into database
        const values: InsertCommit[] = commitSummaries.map((commit) => ({
            commit_hash: commit?.sha || '',
            commit_message: commit?.commit?.message || '',
            repo_id: repoId,
            committer: commit?.author?.login || commit?.commit?.author?.name || '',
            committed_at: commit?.commit?.author?.date || new Date().toISOString(),
            avatar_url: commit?.author?.avatar_url || '',
          }));
        const dbcommits=await db.insert(commitsTable).values(values).returning();
        //now save these db commit ids into the commit summaries table along with the summaries
        const commitIds = dbcommits.map((commit) => {
            return commit.id;
        })
        const summaryValues= commitSummaries.map((commit, index) => {
            return {
                commit_id:commitIds[index],
                summary: commit.summary || "",
            }
        });
        await db.insert(commitSummary).values(summaryValues);


        //update the embedding and resource table for these commits
        // await updateEmbeddingAndResourceTable(commitSummaries, repoId, repoName, repoDetails.user_id || userId);
        return {
            message: "Commits fetched successfully",
            success: true,
            data: commitSummaries,
        }
        // console.log("Commits: ",commits.data);
    } catch (err) {
        console.log("Error in pollcommits",err);
        throw new Error(
            err instanceof Error && err.message.length > 0
                ? err.message
                : "Error, please try again."
        );
    }
}
export const getCommitSummaries = async (commits: Commit[]) => {
    try {
        const summaries = await Promise.all(commits.map(async (commit) => {
            const response = await genAI.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: `
                You are a code summarization assistant. Based on the following patches of different files from a single Git commit.Each patch shows the changes made to a file, generate a concise natural language summary (2-3 sentences) describing the overall changes made in the commit. Focus on what was modified, added, or removed, and the intent behind the changes if it can be inferred. Ignore formatting or minor syntax tweaks unless they significantly affect logic.
                Only return the summary as plain text. Do not include any JSON, markdown, or extra explanation.
                Patches:
                ${commit.files.map(c => `--- PATCH for file: ${c.filename}\n\`\`\`diff\n${c.patch || ""}\n\`\`\``).join("\n\n")}
                `
            })
            const responseText=(response?.text || "").replace(/```json|```/g, "").trim();
            return {
                ...commit,
                summary: responseText,
            }
        }))
        // console.log("Summaries: ", summaries);
        return summaries;
    } catch (err) {
        console.log("Error in getCommitSummaries",err);
        throw new Error(
            err instanceof Error && err.message.length > 0
                ? err.message
                : "Error, please try again."
        );
    }
}

export const getCommitDetails=async (page:number)=>{
    try{
        const commits=(await db.select().from(commitsTable).offset((page-1)*10).limit(10)).sort((a,b)=> {
            return new Date(b.committed_at).getTime() - new Date(a.committed_at).getTime()
        });
        if(!commits || commits.length==0){
            return {
                message:"No commits found",
                success:true,
                data:[],
            }
        }
        const commitIds= commits.map((commit)=>{
            return commit.id;
        });
        return {
            message:"Commits fetched successfully",
            success:true,
            data:commits.map((commit,index)=>{
                return {
                    id:commit.id,
                    commit_hash:commit.commit_hash,
                    commit_message:commit.commit_message,
                    repo_id:commit.repo_id,
                    committer:commit.committer,
                    committed_at:commit.committed_at,
                }
            }),
        }
    }catch(err){
        console.log("Error in getCommitDetails",err);
        throw new Error(
            err instanceof Error && err.message.length > 0
                ? err.message
                : "Error, please try again."
        );
    }
}

export const updateEmbeddingAndResourceTable=async (commits:Commit[],repoId:string,repoName:string,userId:string)=>{
    const repo=await db.select().from(repos).where(eq(repos.id,repoId));
    if(!repo || repo.length==0){
        throw new Error("Repository not found");
    }
    const repoDetails=repo[0];
    const loader = new GithubRepoLoader(
                repoDetails.repo_url,
                {
                    branch: repoDetails.branch || "master",
                    recursive: true,
                    accessToken: repoDetails.personal_access_token || process.env.GITHUB_ACCESS_TOKEN,
                    unknown: "ignore",
                    maxConcurrency: 3,
                    ignorePaths: [
                        "node_modules/**", "dist/**", "build/**", "out/**", "coverage/**", "logs/**", "*.log", ".git/**", ".github/**",
                        ".idea/**", ".vscode/**", ".husky/**", ".DS_Store", "Thumbs.db", "yarn.lock", "package-lock.json", "pnpm-lock.yaml",
                        "vendor/**", "tmp/**", "temp/**", "*.swp", "*.swo", "__pycache__/**", "*.pyc", "*.pyo", "*.class", "target/**",
                        ".next/**", ".nuxt/**", "public/**", "static/**", "storybook-static/**", "firebase.json", "firebase-debug.log",
                        "android/**", "ios/**", ".expo/**", ".cache/**", ".eslintrc*", ".prettierrc*", ".editorconfig", ".env", ".env.*",
                        ".eslintcache", "cypress/videos/**", "cypress/screenshots/**", ".turbo/**", ".yarn/**", ".pnp.cjs", ".pnp.loader.mjs",
                        ".parcel-cache/**", "jspm_packages/**", ".next-tf/**", ".svelte-kit/**", ".astro/**"
                    ],
                }
            );
    const docs = await loader.load() as Docs[];
    commits.sort((a,b)=> {
        return new Date(b.commit?.author?.date || "").getTime() - new Date(a.commit?.author?.date || "").getTime()
    });
    const fileAlreadyProcessed:any={};
    await Promise.all(commits.map(async (commit) => {
        const sha=commit.sha;
        const files=commit.files;
        const filesToBeUpdated=files.map((file)=>{
            if(!Object.keys(fileAlreadyProcessed).includes(file.filename)){
                fileAlreadyProcessed[file.filename]=true;
                if(file?.filename!==undefined && file?.patch!=undefined){
                    return file.filename;
                }
            }
        })

        if(filesToBeUpdated.length==0){
            return;
        }
        


    }));
}