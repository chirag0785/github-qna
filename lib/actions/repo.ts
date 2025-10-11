'use server'
import { GoogleGenAI } from "@google/genai";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { createStreamableValue } from 'ai/rsc';
import { db } from "../db";
import { users } from "../db/schema/users";
import { and, eq, sql } from "drizzle-orm";
import { repos } from "../db/schema/repos";
import { qsAnswers } from "../db/schema/questionAnswer";
import { userRepos } from "../db/schema/userRepos";
type Resource = {
    id: string;
    repo_id: string;
    content: string;
    repo_name: string;
    file_path: string;
    createdAt: Date;
    updatedAt: Date;
}
const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
})
export const cloneRepo = async (repoUrl: string, repoName: string, personalAccessToken?: string, branch?: string) => {
    try {
        if (!repoUrl.startsWith("https://") && !repoUrl.startsWith("git@")) {
            throw new Error("Invalid repository URL. Please provide a valid GitHub repository URL.");
        }

        let newUrl = repoUrl;
        const accessToken = personalAccessToken || process.env.GITHUB_ACCESS_TOKEN;
        if (!accessToken) {
            throw new Error("GitHub Access Token is required to access private repositories.");
        }
        const loader = new GithubRepoLoader(
            newUrl,
            {
                branch: branch || "master",
                recursive: true,
                accessToken: accessToken,
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
        const docs = await loader.load();
        console.log(docs);
        return {
            message: `Repository processed successfully.`,
            files: docs,
            repoName: repoName,
        };
    } catch (error) {
        console.log(error);
        throw new Error(
            error instanceof Error && error.message.length > 0
                ? error.message
                : "Error, please try again."
        );
    }
};

// export const extractFilesFromRepo=async (repoName: string) => {
//     try {
//         const repoPath = path.join(process.cwd(), "repo", repoName);
//         //for file extraction we will use a recursive approach
//         const files: string[] = [];
//         const extractFiles = (dir: string) => {
//             const items = fs.readdirSync(dir);  //reading the directory
//             items.forEach((item) => {
//                 const itemPath = path.join(dir, item);
//                 if (fs.statSync(itemPath).isDirectory()) {      //used to check if current itemPath is a file or directory
//                     extractFiles(itemPath);     //recursively call if it is also a directory
//                 } else {
//                     if(itemPath.endsWith('.js')||itemPath.endsWith('.ts')||itemPath.endsWith('.jsx')||itemPath.endsWith('.tsx')){
//                         files.push(itemPath);
//                     }
//                 }
//             });
//         };
//         extractFiles(repoPath);
//         return {
//             message: "Files extracted successfully.",
//             files: files,
//         };
//     } catch (error) {
//         throw new Error(
//             error instanceof Error && error.message.length > 0
//                 ? error.message
//                 : "Error, please try again."
//         );
//     }
// };

// export const readFile=async (filePath:string)=>{
//     try{
//         const fileContent=fs.readFileSync(filePath,'utf-8');
//         return {
//             message:"File read successfully.",
//             content:fileContent
//         }
//     }catch(err){
//         throw new Error(
//             err instanceof Error && err.message.length > 0
//                 ? err.message
//                 : "Error, please try again."
//         );
//     }
// }

export const getFileDescriptionsAndQueryResults = async (files: Resource[], query: string) => {
    try {
        // Constructing the prompt to be sent to the AI model
        const prompt = `
You are a ai code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand the codebase better.

AI assistant is a brand new, powerful, human like artificial intelligence. The traits of AI include expert knowledge, helpfulness, cleverness and articulateness.

AI is a well behaved and well mannered individual who always answers the question in a friendly and professional manner.

AI has sum of all knowledge in their brain  and is able to answer nearly any question about any topic in conversation.

If the question is not relevant to the codebase, politely inform the user that you are unable to answer the question.

If the question is about the code or a specific file, AI will provide a detailed and comprehensive answer, giving step by step instructions, including code snippets.

Your task is to carefully read and analyze a set of source files and a user query. Each file is provided with its filename and full content inside triple backticks. The user query is also enclosed in backticks.


### Please return your answer **formatted as Markdown**:

- **Do not** return plain text, JSON, code blocks, or bullet points.
- Ensure proper headings, indentation, and clarity for easy readability in a Markdown editor.
- Be mindful of visual hierarchy and use appropriate Markdown formatting like **bold**, *italic*, and \`code\` where needed.

**Start of the Context**

${files.map(file => `
### Filename: \`${file.file_path}\`

\`\`\`txt
${file.content.slice(0, 10000)}\`\`\`
`).join('\n')}

**End of the Context**

**Start Question**

\`\`\`
${query}
\`\`\`

**End of Question**
`;

        // Sending the prompt to the AI model for content generation
        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt
        });

        // Processing and cleaning the response
        const responseText = (response?.text || "").replace(/```json|```/g, "").trim();

        // Returning the formatted response
        return responseText;
    } catch (err) {
        console.error("Error in getFileDescriptionsAndQueryResults:", err);

        // Throwing a more informative error message
        throw new Error(
            err instanceof Error && err.message.length > 0
                ? err.message
                : "An error occurred, please try again."
        );
    }
};

export const askQuestion = async (question: string, repoId: string, userId: string) => {
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userList.length == 0) {
        throw new Error("User not found");
    }
    const user = userList[0];
    if (!user.credits || user.credits < 5) {
        throw new Error("Not enough credits. Please purchase more credits to ask queries.");
    }
    if (!question) {
        throw new Error("Query not provided");
    }

    try {
        const matchedRepos = await db
            .select()
            .from(repos)
            .where(eq(repos.id, repoId));
        if (!matchedRepos || matchedRepos.length == 0) {
            throw new Error("Repository not found");
        }
        const embeddingResponse = await genAI.models.embedContent({
            model: "models/text-embedding-004",
            contents: [question],
            config: {
                taskType: "RETRIEVAL_DOCUMENT",
            },
        });
        if (
            !embeddingResponse ||
            !embeddingResponse.embeddings ||
            embeddingResponse.embeddings.length == 0
        ) {
            throw new Error("Embedding not found");
        }
        const queryEmbedding = embeddingResponse?.embeddings[0].values;
        if (!queryEmbedding) {
            throw new Error("Query Embedding not found");
        }

        // Format the vector as a valid pgvector literal
        const queryVector = `[${queryEmbedding.join(",")}]`;

        // Use raw SQL to pass the vector as a literal
        const results = await db.execute(
            sql`
            SELECT *,
            1-("embedding" <=> ${queryVector}::vector) AS similarity
            FROM "embeddings"
            WHERE 1 - ("embedding" <=> ${queryVector}::vector) > .5
            AND "resource_id" IN (
              SELECT "id" FROM "resources" WHERE "repo_id" = ${repoId})
            ORDER BY similarity DESC
            LIMIT 10
          `
        );
        const resourceIds = results.map((result) => result.resource_id);
        console.log(resourceIds);
        const resourceResults = await db.execute(
            sql`SELECT * FROM "resources"
                WHERE "id" = ANY(ARRAY[${sql.join(
                resourceIds.map((id) => sql`${id}`),
                sql`,`
            )}]) 
                AND "repo_id" = ${repoId}`
        );

        const referencedFiles = resourceResults.map((resource) => ({ name: resource.file_path as string, content: resource.content as string, summary: resource.summary as string }));
        let context = '';
        for (const doc of resourceResults) {
            context += `source: ${doc.file_path}\ncode content: ${doc.content}\n summary of file: ${doc.summary}\n\n`
        }


        const stream = createStreamableValue();
        (async () => {
            const prompt = `
You are a ai code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand the codebase better.
AI assistant is a brand new, powerful, human like artificial intelligence. The traits of AI include expert knowledge, helpfulness, cleverness and articulateness.
AI is a well behaved and well mannered individual who always answers the question in a friendly and professional manner.
AI has sum of all knowledge in their brain  and is able to answer nearly any question about any topic in conversation.
If the question is not relevant to the codebase, politely inform the user that you are unable to answer the question.
If the question is about the code or a specific file, AI will provide a detailed and comprehensive answer, giving step by step instructions, including code snippets.
START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

START QUESTION
${question}
END OF QUESTION
AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer"
AI will not apologize for previous responses, but instead will indicated new information was gained
AI assistant will not invent anything that is not drawn directly from the context.
Answer in markdown syntax, with code snippets if need. Be as detailed as possible while answering the question.
`;
            try {
                const response = await genAI.models.generateContentStream({
                    model: 'gemini-2.0-flash',
                    contents: prompt,
                })

                for await (const delta of response) {
                    stream.update(delta.text);
                }
            } catch (err) {
                stream.update("Error generating response");
            } finally {
                stream.done();
            }
        })()

        await db.update(users).set({
            credits: sql`users.credits-5`,
        }).where(eq(users.id, userId));
        return {
            response: stream.value,
            referencedFiles
        }
    } catch (err: any) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const saveQuestionAnswer = async (repoId: string, userId: string, profileImg: string, question: string, answer: string, filesReferenced: {
    name: string,
    content: string,
    summary: string
}[]) => {

    try {
        const repoResult = await db.select().from(repos).where(eq(repos.id, repoId));
        if (!repoResult || repoResult.length == 0) {
            throw new Error("Repo not found");
        }

        await db.insert(qsAnswers).values({
            repo_id: repoId,
            question,
            answer,
            filesReferenced,
            user_id: userId,
            profile_img: profileImg,
        })
        return {
            message: "Answer saved successfully"
        }
    } catch (err: any) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getQuestionAnswers = async (repoId: string) => {
    try {
        const repoResult = await db.select().from(repos).where(eq(repos.id, repoId));
        if (!repoResult || repoResult.length == 0) {
            throw new Error("Repo not found");
        }

        const qsResult = await db.select().from(qsAnswers).where(eq(qsAnswers.repo_id, repoId));
        return {
            data: qsResult,
            message: "Answer saved successfully"
        }
    } catch (err: any) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getTeamMembers= async (repoId:string)=>{
    try{
        const result=await db.select({
            id:users.id,
            name: users.name,
            profile_img: users.profile_img,
        }).from(userRepos).where(eq(userRepos.repo_id,repoId)).innerJoin(users,eq(userRepos.user_id,users.id));

        return result;
    }catch(err:any){
        console.error(err);
        throw new Error(err.message);
    }
}

export const addTeamMember= async (repoId:string,userId:string)=> {
    try{
        //check if already available
        const result=await db.select().from(userRepos).where(and(eq(userRepos.repo_id,repoId),eq(userRepos.user_id,userId)));
        if(result && result.length>0){
            throw new Error("Repository already added");
        }
        await db.insert(userRepos).values({repo_id:repoId,user_id:userId});
        return {
            success:true,
            message:"Team Member added success",
        }
    }catch(err:any){
        console.error(err);
        throw new Error(err.message);
    }
}