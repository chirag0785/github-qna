import { GoogleGenAI } from "@google/genai";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
type Resource={
    id:string;
    repo_id:string;
    content:string;
    repo_name:string;
    file_path:string;
    createdAt:Date;
    updatedAt:Date;
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
You are a highly intelligent file analysis system.

Your task is to carefully read and analyze a set of source files and a user query. Each file is provided with its filename and full content inside triple backticks. The user query is also enclosed in backticks.

Your goal is to provide a thoughtful, well-reasoned answer to the query using only the information found in the file contents. Your answer should:

1. Start by directly answering the user's query in a clear and precise manner.
2. Use insights strictly from the file contents. Do **not** make assumptions or rely on external knowledge.
3. Refer to the files that are relevant to your answer. Briefly summarize what each file contains and how it helps address the query.
4. Include specific code snippets (or parts of them) from the files that are directly relevant to answering the query. 
5. If you use any code, explain clearly which parts you are referencing and why they are important.
6. Ensure that your entire explanation is written in natural language that flows well, demonstrating a deep understanding of the content.

### Please return your answer **formatted as Markdown**:

- **Do not** return plain text, JSON, code blocks, or bullet points.
- Ensure proper headings, indentation, and clarity for easy readability in a Markdown editor.
- Be mindful of visual hierarchy and use appropriate Markdown formatting like **bold**, *italic*, and \`code\` where needed.

---

**Query:**

\`\`\`
${query}
\`\`\`

---

**Files:**

${files.map(file => `
### Filename: \`${file.file_path}\`

\`\`\`txt
${file.content.slice(0, 10000)}\`\`\`
`).join('\n')}

`;

        // Sending the prompt to the AI model for content generation
        const response = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
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
