import { cloneRepo } from "@/lib/actions/repo";
import { createResource } from "@/lib/actions/resources";
import { db } from "@/lib/db";
import { repos } from "@/lib/db/schema/repos";
import { userRepos } from "@/lib/db/schema/userRepos";
import { users } from "@/lib/db/schema/users";
import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import { and, eq, sql } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";
type Docs = {
    pageContent: string;
    metadata: {
        repository: string;
        branch: string;
        source: string;
    }
}
export async function POST(request: NextRequest) {
    const { repoUrl, repoName, personalAccessToken, branch } = await request.json();
    const { userId } = getAuth(request);
    if (!userId) {
        return NextResponse.json({
            message: "Unauthorized",
            success: false
        }, { status: 401 });
    }
    try {
        const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (userList.length == 0) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        //check if repository already exists or not 
        const repoList = await db.select().from(repos).where(eq(repos.repo_url, repoUrl));
        const user = userList[0];
        if (repoList.length > 0) {
            //repo already exists 
            const userRepoList = await db.select().from(userRepos).where(and(eq(userRepos.repo_id, repoList[0].id), eq(userRepos.user_id, user.id))).limit(1);
            if (userRepoList.length > 0) return NextResponse.json({
                message: "Repository already exists for the user, check the repositories",
                success: false,
            }, { status: 409 })
            //different flow
            //do a api call to github to check the private status of this repo
            const url=new URL(repoList[0].repo_url);
            const repoDetails=url.pathname.split('/').filter((val)=> val.length>0);
            const { data } = await axios.get(`https://api.github.com/repos/${repoDetails[0]}/${repoDetails[1].replace(/\.git$/,'')}`, {
                headers: {
                    "Authorization": `token ${personalAccessToken ? personalAccessToken : process.env.GITHUB_ACCESS_TOKEN}`,
                    "Accept": "application/vnd.github+json",
                    "User-Agent": 'Github-QnA',
                }
            })
            console.log(data);

            if (data.private) {
                return NextResponse.json({
                    message: "Private Repository already exists, talk to team to invite you as member or fork the repository to upload it.",
                    success: false,
                }, { status: 409 })
            }

            //add this user to the already existing repo team
            const repo = repoList[0];
            await db.insert(userRepos).values({
                repo_id: repo.id,
                user_id: user.id,
            })
            

            //no credits deducted for this
            return NextResponse.json({
                message: "Member added successfully to the exisiting public repository",
                success: true,
                repoName: repoName,
                repoId: repo.id
            }, { status: 200 });
        }
        if (!user.credits || user.credits < 50) {
            return NextResponse.json({
                message: "Not enough credits. Please purchase more credits to upload repository.",
                success: false
            }, { status: 403 });
        }
        const result = await cloneRepo(repoUrl, repoName, personalAccessToken, branch);
        const files = result.files as Docs[];
        if (files.length === 0) throw new Error("No files found");
        //now store this into repos
        const [repo] = await db
            .insert(repos)
            .values({ name: repoName, personal_access_token: personalAccessToken ? personalAccessToken : "", repo_url: repoUrl, branch: branch || "master" })
            .returning();

        console.log("Repository stored in database");

        //now link this repo with user
        await db.insert(userRepos).values({
            user_id: user.id,
            repo_id: repo.id
        })

        //now these files will be used to extract content from them
        console.log("Reading files started");
        const filesWithContents = files.map(({ pageContent, metadata }) => {
            return { filePath: metadata.source, content: pageContent };
        })
        console.log("Reading files done");

        await createResource(filesWithContents, repoName, repo.id);

        await db
            .update(users)
            .set({ credits: sql`${users.credits} - 50` })
            .where(eq(users.id, userId));

        return NextResponse.json({
            message: "Repository uploaded successfully",
            success: true,
            repoName: repoName,
            repoId: repo.id
        }, { status: 200 });
    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            message: err.message,
            success: false
        }, { status: 500 });
    }
}