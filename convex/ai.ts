import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";


/**
 * generateMessage
 * Calls the Ollama API for text generation. Best practice: never log secrets, always validate tenant.
 */
export const generateMessage = action({
  args: {
    tenantId: v.id("tenants"),
    prompt: v.string(),
    opts: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // TODO: Replace with actual Ollama API call
    // Example: fetch from process.env.OLLAMA_API_URL
    return { text: `Generated for: ${args.prompt}` };
  },
});


/**
 * ingestDocs
 * Ingest documents into RAG. Best practice: enforce tenant isolation.
 */
export const ingestDocs = action({
  args: {
    tenantId: v.id("tenants"),
    documents: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO: Replace with actual RAG ingestion logic
    for (const text of args.documents) {
      await ctx.db.insert("ragDocuments", {
        tenantId: args.tenantId,
        text,
        createdAt: Date.now(),
      });
    }
    return null;
  },
});


/**
 * queryRag
 * Query RAG for context. Best practice: enforce tenant isolation.
 */
export const queryRag = query({
  args: {
    tenantId: v.id("tenants"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO: Replace with actual RAG query logic
    const docs = await ctx.db
      .query("ragDocuments")
      .withIndex("by_tenantId", (q) => q.eq("tenantId", args.tenantId))
      .collect();
    // Simple keyword match for demo
    return docs.filter((d) => d.text.includes(args.query)).map((d) => d.text);
  },
});

// TODO: Implement streamPreview - stream AI preview
export const streamPreview = action({
  args: {
    tenantId: v.id("tenants"),
    prompt: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    // TODO: Business logic to stream preview
    throw new Error("Not implemented");
  },
});