import { getFileDescriptionsAndQueryResults } from "@/lib/actions/repo";
import { db } from "@/lib/db";
import { repos } from "@/lib/db/schema/repos";
import { users } from "@/lib/db/schema/users";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});
export async function GET(
  request: NextRequest,
  { params }: { params: { repoId: string } }
) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") as string;
  const {userId}=auth();
  if(!userId){
    return NextResponse.json({
      message:"Unauthorized",
      success:false
    },{status:401});
  }
  const userList=await db.select().from(users).where(eq(users.id,userId)).limit(1);
  if(userList.length==0){
    return NextResponse.json({
      message:"User not found",
      success:false
    },{status:404});
  }
  const user=userList[0];
  if(!user.credits || user.credits<5){
    return NextResponse.json({
      message:"Not enough credits. Please purchase more credits to ask queries.",
      success:false
    },{status:403});
  }

  const repoId = params.repoId;
  if (!query || !repoId) {
    return NextResponse.json(
      {
        message: "Query or repoId not found",
        success: false,
      },
      { status: 400 }
    );
  }

  try {
    const matchedRepos = await db
      .select()
      .from(repos)
      .where(eq(repos.id, repoId));
    if (!matchedRepos || matchedRepos.length == 0) {
      return NextResponse.json(
        {
          message: "Repository not found",
          success: false,
        },
        { status: 404 }
      );
    }
    const repo = matchedRepos[0];
    //generate embedding of the query for efficient search
    const embeddingResponse = await genAI.models.embedContent({
      model: "text-embedding-004",
      contents: [query],
      config: {
        taskType: "RETRIEVAL_DOCUMENT",
      },
    });
    if (
      !embeddingResponse ||
      !embeddingResponse.embeddings ||
      embeddingResponse.embeddings.length == 0
    ) {
      return NextResponse.json(
        {
          message: "Embedding not found",
          success: false,
        },
        { status: 404 }
      );
    }
    const queryEmbedding = embeddingResponse?.embeddings[0].values;
    if (!queryEmbedding) {
      return NextResponse.json(
        {
          message: "Query embedding not found",
          success: false,
        },
        { status: 404 }
      );
    }
    // Format the vector as a valid pgvector literal
    const queryVector = `[${queryEmbedding.join(",")}]`;

    // Use raw SQL to pass the vector as a literal
    const results = await db.execute(
      sql`
    SELECT *,
    1-("embedding" <=> ${queryVector}::vector) AS similarity
    FROM "embeddings"
    WHERE 1 - ("embedding" <=> ${queryVector}::vector) > .5
    AND "resource_id" IN (
      SELECT "id" FROM "resources" WHERE "repo_id" = ${repoId})
    ORDER BY similarity DESC
    LIMIT 5
  `
    );
    console.log(
      results.map((r) => ({
        resource_id: r.resource_id,
        similarity: r.similarity,
      }))
    );

    if (!results || results.length == 0) {
      return NextResponse.json(
        {
          message: "No results found",
          success: false,
        },
        { status: 404 }
      );
    }
    const resourceIds = results.map((result) => result.resource_id);
    console.log(resourceIds);
    const resourceResults = await db.execute(
      sql`SELECT * FROM "resources"
                WHERE "id" = ANY(ARRAY[${sql.join(
        resourceIds.map((id) => sql`${id}`),
        sql`,`
      )}]) 
                AND "repo_id" = ${repoId}`
    );

    if (!resourceResults || resourceResults.length == 0) {
      return NextResponse.json(
        {
          message: "No resources found",
          success: false,
        },
        { status: 404 }
      );
    }

    const answerToQuery = await getFileDescriptionsAndQueryResults(
      resourceResults as any,
      query
    );

    const finalResult = resourceResults.map((file, index) => {
      return {
        name: resourceResults[index].file_path,
        content: resourceResults[index].content,
      };
    });

    //decrement the credit required for it
    await db.update(users).set({credits:sql`${users.credits} - 5`}).where(eq(users.id,userId));
    return NextResponse.json(
      {
        message: "Resources found",
        success: true,
        data: finalResult,
        answer: answerToQuery,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      {
        message: err.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
