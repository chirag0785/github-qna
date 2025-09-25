
import { resources } from '@/lib/db/schema/resources';
import { db } from '../db';
import { embeddings as embeddingsTable } from '@/lib/db/schema/embeddings';
import { GoogleGenAI } from "@google/genai"
import { eq } from 'drizzle-orm';
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
})
export const createResource = async (files: { content: string, filePath: string }[], repoName: string, repoId: string) => {
  try {
    files=files.filter(file=> file.content && file.filePath);
    //insert files into resources table
    await db.insert(resources).values(files.map((file) => {
      return {
        content: file.content,
        file_path: file.filePath,
        repo_name: repoName,
        repo_id: repoId
      }
    }))

    const resourcesOfRepo=await db.select().from(resources).where(eq(resources.repo_id,repoId));
    //generate summaries for each file
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `
        You are a code summarization assistant. Your task is to summarize each provided code file separately.
        Return the response in a structured JSON format where each key is the file name and the value is its summary.
        The summary should not exceed 1000 words per file.
    
        Here are the files:
        ${files.map((file, index) => `File ${index + 1}: ${file.filePath}\nContent:\n${file.content}`).join("\n\n")}
      `
    });
    const responseText=(response?.text || "").replace(/```json|```/g, "").trim();
    
    console.log("Response from Gemini: ", responseText);
    const summaries=JSON.parse(responseText || "{}");

    
    console.log("Summaries: ", summaries);
    // const generatedEmbeddings = await generateEmbedding(content);
    // const embeddings = generatedEmbeddings.map(embedding => ({
    //   resourceId: resource.id,
    //   content: embedding.content,
    //   embedding: Array.from(embedding.embedding),
    // }));

    // await db.insert(embeddingsTable).values(embeddings);
    const embeddingResponse=await genAI.models.embedContent({
      model:'text-embedding-004',
      contents:Object.keys(summaries).map((path)=> summaries[path]),
      config:{
        taskType:'RETRIEVAL_DOCUMENT'
      }
    });
    if(!embeddingResponse || !embeddingResponse.embeddings) {
      throw new Error("Error generating embeddings");
    }
    console.log("Embedding response: Successfully generated embeddings");
    
    const embeddings=embeddingResponse.embeddings?.map((embedding)=> embedding.values);

    await db.insert(embeddingsTable).values(
      Object.keys(summaries).map((path, index) => {
        return {
          resourceId:resourcesOfRepo[index]?.id,
          repoName: repoName,
          filePath: path,
          embedding: embeddings ? Array.from(embeddings[index] ?? []) : [],
        }
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
