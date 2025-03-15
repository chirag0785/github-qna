import { simpleGit } from "simple-git";
import path from "path";
import fs from "fs";


export const cloneRepo = async (repoUrl: string, repoName: string, personalAccessToken?: string) => {
    try {
        if (!repoUrl.startsWith("https://") && !repoUrl.startsWith("git@")) {
            throw new Error("Invalid repository URL. Please provide a valid HTTPS or SSH URL.");
        }

        let newUrl = repoUrl;
        if (personalAccessToken) {
            newUrl = repoUrl.replace("https://", `https://${personalAccessToken}@`);
        }

        const repoPath = path.join(process.cwd(), "repo", repoName);

        if (fs.existsSync(repoPath)) {
            return {
                message: `Repository '${repoName}' already exists at '${repoPath}'.`,
                path: repoPath,
            }
        }

        fs.mkdirSync(repoPath, { recursive: true });

        const git = simpleGit();
        await git.clone(newUrl, repoPath);

        return {
            message: `Repository '${repoName}' cloned successfully at '${repoPath}'.`,
            path: repoPath,
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

export const extractFilesFromRepo=async (repoName: string) => {
    try {
        const repoPath = path.join(process.cwd(), "repo", repoName);
        //for file extraction we will use a recursive approach
        const files: string[] = [];
        const extractFiles = (dir: string) => {
            const items = fs.readdirSync(dir);  //reading the directory
            items.forEach((item) => {
                const itemPath = path.join(dir, item);
                if (fs.statSync(itemPath).isDirectory()) {      //used to check if current itemPath is a file or directory
                    extractFiles(itemPath);     //recursively call if it is also a directory
                } else {
                    if(itemPath.endsWith('.js')||itemPath.endsWith('.ts')||itemPath.endsWith('.jsx')||itemPath.endsWith('.tsx')){
                        files.push(itemPath);
                    }
                }
            });
        };
        extractFiles(repoPath);
        return {
            message: "Files extracted successfully.",
            files: files,
        };
    } catch (error) {
        throw new Error(
            error instanceof Error && error.message.length > 0
                ? error.message
                : "Error, please try again."
        );
    }
};

export const readFile=async (filePath:string)=>{
    try{
        const fileContent=fs.readFileSync(filePath,'utf-8');
        return {
            message:"File read successfully.",
            content:fileContent
        }
    }catch(err){
        throw new Error(
            err instanceof Error && err.message.length > 0
                ? err.message
                : "Error, please try again."
        );
    }
}

