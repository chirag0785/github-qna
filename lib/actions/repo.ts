import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
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

