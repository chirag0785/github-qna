import { pipeline } from "@xenova/transformers";
const modelName = "sentence-transformers/all-MiniLM-L6-v2";
const embedderPromise = pipeline("feature-extraction", modelName,{
    quantized:false,
});
const generateChunks = (code: string, chunkSize: number): string[] => {
    const statements = code.split(/(?<=;|{|})\s*\n?/g); 
    const chunks: string[] = [];
    let currentChunk = "";

    for (const statement of statements) {
        if ((currentChunk.length + statement.length) <= chunkSize) {
            currentChunk += statement;
        } else {
            chunks.push(currentChunk.trim());
            currentChunk = statement;
        }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
};

export async function generateEmbedding(text: string) {
    try {
        const embedder = await embedderPromise;
        const chunks = generateChunks(text, 512);
        console.log("chunks",chunks);
        // Generate embeddings for each chunk
        const embeddings = await Promise.all(chunks.map(async (chunk) => {
            const embedding = await embedder(chunk, { pooling: "mean", normalize: true });
            return { embedding: embedding.data, content: chunk };
        }));
        console.log("error nhi aaya");
        return embeddings;
    } catch (error) {
        console.error("Failed to generate embeddings:", error);
        throw new Error("Failed to generate embeddings. Please check the model configuration.");
    }
}
