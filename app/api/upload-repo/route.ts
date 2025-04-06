import { cloneRepo } from "@/lib/actions/repo";
import { createResource } from "@/lib/actions/resources";
import { db } from "@/lib/db";
import { repos } from "@/lib/db/schema/repos";
import { users } from "@/lib/db/schema/users";
import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";
type Docs={
    pageContent:string;
    metadata:{
        repository:string;
        branch:string;
        source:string;
    }
}
export async function POST(request:NextRequest){
    const {repoUrl,repoName,personalAccessToken,branch}=await request.json();
    console.log(repoUrl,repoName,personalAccessToken,branch);
    const {userId}=getAuth(request);
    if(!userId){
        return NextResponse.json({
            message:"Unauthorized",
            success:false
        },{status:401});
    }
    try{
        const userList=await db.select().from(users).where(eq(users.id,userId)).limit(1);
        console.log(userList);
        if(userList.length==0){
            return NextResponse.json({
                message:"User not found",
                success:false
            },{status:404});
        }
        const user=userList[0];
        //clone the repository
        console.log("here1");
        const result=await cloneRepo(repoUrl,repoName,personalAccessToken,branch);
        console.log("here2");
        const files=result.files as Docs[];
        if (files.length === 0) throw new Error("No files found");
        //now store this into repos
        const [repo]=await db
                            .insert(repos)
                            .values({name:repoName,user_id:userId,personal_access_token:personalAccessToken? personalAccessToken:"",repo_url:repoUrl,branch:branch || "master"})
                            .returning();

        console.log("Repository stored in database");

        //add this repo into user 
        await db.update(users).set({repos:[...user.repos,repo.id]}).where(eq(users.id,userId));

        //now these files will be used to extract content from them
        console.log("Reading files started");
        const filesWithContents=files.map(({pageContent,metadata})=>{
            return {filePath:metadata.source,content:pageContent};
        })
        console.log("Reading files done");

        //now we will send it for summarization
        const summarizedFiles=await createResource(filesWithContents,repoName,repo.id);
        
        // console.log("Generating embeddings started");
        // //process files in batches of 3
        // const batchSize=3;
        // const batches = Math.ceil(filesWithContents.length / batchSize);
        // for (let i = 0; i < batches; i++) {
        //     const batch = filesWithContents.slice(i * batchSize, (i + 1) * batchSize);
        //     await Promise.all(batch.map(async (file) => {
        //         try {
        //             const { filePath, content } = file;
        //             const { id } = await createResource(filePath, repoName, content,repo.id);
        //             return { id, filePath, repoName };
        //         } catch (err: any) {
        //             console.log(err);
        //             throw new Error(err);
        //         }
        //     }));

        //     await createResource(batch,repoName,repo.id);
        // }
        // console.log("Generating embeddings done");
        // //now we will send the files to generate content from these and embedding willl be formed
        
        // const resources=await Promise.all(filesWithContents.map(async (file)=>{
        //     try{
        //         const {filePath,content}=file;
        //         const {id}=await createResource(filePath,repoName,content,repo.id);
        //         return {id,filePath,repoName};
        //     }catch(err:any){
        //         console.log(err);
        //         throw new Error(err);
        //     }
        // }))
        

        return NextResponse.json({
            message:"Repository uploaded successfully",
            success:true,
            repoName:repoName,
            repoId:repo.id
        },{status:200});
    }catch(err:any){
        console.log(err);
        return NextResponse.json({
            message:err.message,
            success:false
        },{status:500});
    }
}