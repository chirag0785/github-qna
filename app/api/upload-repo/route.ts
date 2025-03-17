import { cloneRepo, extractFilesFromRepo, readFile } from "@/lib/actions/repo";
import { createResource } from "@/lib/actions/resources";
import { db } from "@/lib/db";
import { repos } from "@/lib/db/schema/repos";
import { users } from "@/lib/db/schema/users";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const {repoUrl,repoName,personalAccessToken}=await request.json();
    const {userId}=await auth();
    if(!userId){
        return NextResponse.json({
            message:"Unauthorized",
            success:false
        },{status:401});
    }
    try{
        const userList=await db.select().from(users).where(eq(users.id,userId)).limit(1);
        if(userList.length==0){
            return NextResponse.json({
                message:"User not found",
                success:false
            },{status:404});
        }
        const user=userList[0];
        //clone the repository
        console.log("Cloning started");
        const clonedResult=await cloneRepo(repoUrl,repoName,personalAccessToken);
        console.log("Cloning done");
        //now store this into repos
        const [repo]=await db
                            .insert(repos)
                            .values({name:repoName,user_id:userId})
                            .returning();

        if(repo){
            user.repos.push(repo.id);
            await db.update(users).set({repos:user.repos}).where(eq(users.id,userId));
        }
        console.log("Repository stored in database");
        //extract files from the repository
        console.log("Extracting files started");
        const {files}=await extractFilesFromRepo(repoName);
        console.log("Extracting files done");
        //now these files will be used to extract content from them
        console.log("Reading files started");
        const filesWithContents=await Promise.all(files.map(async (filePath:string)=>{
            try{
                const {content}=await readFile(filePath);
                return {filePath,content};
            }catch(err:any){
                console.log(err);
                throw new Error(err);
            }
        }))
        console.log("Reading files done");

        //now we will send the files to generate content from these and embedding willl be formed
        console.log("Generating embeddings started");
        const resources=await Promise.all(filesWithContents.map(async (file)=>{
            try{
                const {filePath,content}=file;
                const {id}=await createResource(filePath,repoName,content,repo.id);
                return {id,filePath,repoName};
            }catch(err:any){
                console.log(err);
                throw new Error(err);
            }
        }))
        console.log("Generating embeddings done");

        return NextResponse.json({
            message:"Repository cloned and embeddings generated successfully.",
            success:true
        },{status:200});
    }catch(err:any){
        console.log(err);
        return NextResponse.json({
            message:err.message,
            success:false
        },{status:500});
    }
}