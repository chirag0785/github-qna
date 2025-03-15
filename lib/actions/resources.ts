'use server';

import { resources } from '@/lib/db/schema/resources';
import { db } from '../db';
import { generateEmbedding } from '../ai/embedding';
import { embeddings as embeddingsTable } from '@/lib/db/schema/embeddings';

export const createResource = async (filePath: string, repoName: string, content: string) => {
  try {
    const [resource] = await db
      .insert(resources)
      .values({ file_path: filePath, repo_name: repoName })
      .returning();
    
    const generatedEmbeddings = await generateEmbedding(content);
    const embeddings = generatedEmbeddings.map(embedding => ({
      resourceId: resource.id,
      content: embedding.content,
      embedding: Array.from(embedding.embedding),
    }));

    await db.insert(embeddingsTable).values(embeddings);
    return {
      id: resource.id,
      repoName: resource.repo_name,
      filePath: resource.file_path,
    }
  } catch (error) {
    throw new Error(
      error instanceof Error && error.message.length > 0  
        ? error.message
        : "Error, please try again."
    );
  }
};
