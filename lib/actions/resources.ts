import { resources } from "@/lib/db/schema/resources";
import { db } from "../db";
import { embeddings as embeddingsTable } from "@/lib/db/schema/embeddings";
import { GoogleGenAI } from "@google/genai";
import { eq } from "drizzle-orm";
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});
const BATCH_SIZE = 5;
export const createResource = async (
  files: { content: string; filePath: string }[],
  repoName: string,
  repoId: string
) => {
  try {
    files = files.filter((file) => file.content && file.filePath);


    const batches = [];
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      batches.push(files.slice(i, i + BATCH_SIZE));
    }

    //process in batch of files
    let summaries: Record<string, string> = {};
    for (const batch of batches) {
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects. You are onboarding a junior software engineer and explaining the purpose of each file in the codebase. You are given a list of files with their file paths and contents. You need to generate a summary for each file explaining its purpose in the codebase for the junior software engineer.  
Return the response in a structured JSON format where each key is the file path and the value is its summary.  
The summary should not exceed 100 words per file. 

Here are the files:
${batch
            .map(
              (resource) =>
                `File Path: ${resource.filePath}\nContent:\n\`\`\`${resource.content}\`\`\``
            )
            .join("\n\n")}

Provide the response in JSON format only.
  `
      });

      const responseText = (response?.text || "")
        .replace(/```json|```/g, "")
        .trim();
      const fileSummaries = JSON.parse(responseText || "{}");
      summaries = {
        ...summaries,
        ...fileSummaries,
      };
    }
    console.log("Summaries: ", summaries);
    // const generatedEmbeddings = await generateEmbedding(content);
    // const embeddings = generatedEmbeddings.map(embedding => ({
    //   resourceId: resource.id,
    //   content: embedding.content,
    //   embedding: Array.from(embedding.embedding),
    // }));

    // await db.insert(embeddingsTable).values(embeddings);

    await db.insert(resources).values(
      files.map((file) => {
        return {
          content: file.content,
          file_path: file.filePath,
          repo_name: repoName,
          repo_id: repoId,
          summary: summaries[file.filePath]
        };
      })
    );

    const resourcesOfRepo = await db.select().from(resources).where(eq(resources.repo_id, repoId));
    const embeddingResponse = await genAI.models.embedContent({
      model: "text-embedding-004",
      contents: Object.keys(summaries).map((path) => summaries[path]),
      config: {
        taskType: "RETRIEVAL_DOCUMENT",
      },
    });
    if (!embeddingResponse || !embeddingResponse.embeddings) {
      throw new Error("Error generating embeddings");
    }
    console.log("Embedding response: Successfully generated embeddings");

    const embeddings = embeddingResponse.embeddings?.map(
      (embedding) => embedding.values
    );

    await db.insert(embeddingsTable).values(
      Object.keys(summaries).map((path, index) => {
        return {
          resourceId: resourcesOfRepo[index]?.id,
          repoName: repoName,
          filePath: path,
          embedding: embeddings ? Array.from(embeddings[index] ?? []) : [],
        };
      })
    );

    console.log("Embeddings inserted successfully");
    return {
      message: "Repo uploaded successfully.",
      success: true,
      repoName: repoName,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error && error.message.length > 0
        ? error.message
        : "Error, please try again."
    );
  }
};
