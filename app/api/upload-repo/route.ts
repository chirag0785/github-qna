import { cloneRepo, extractFilesFromRepo, readFile } from "@/lib/actions/repo";
import { createResource } from "@/lib/actions/resources";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const {repoUrl,repoName,personalAccessToken}=await request.json();
    try{
        //clone the repository
        console.log("Cloning started");
        const clonedResult=await cloneRepo(repoUrl,repoName,personalAccessToken);

        console.log("Cloning done");
        const {path}=clonedResult;
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
                const {id}=await createResource(filePath,repoName,content);
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