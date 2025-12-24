import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// TODO: Implement generateMessage - generate AI message content
export const generateMessage = action({
  args: {
    tenantId: v.id("tenants"),
    prompt: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    // TODO: Business logic to generate message using Ollama
    throw new Error("Not implemented");
  },
});

// TODO: Implement ingestDocs - ingest documents into RAG
export const ingestDocs = action({
  args: {
    tenantId: v.id("tenants"),
    documents: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // TODO: Business logic to ingest documents into RAG
    throw new Error("Not implemented");
  },
});

// TODO: Implement queryRag - query RAG for context
export const queryRag = query({
  args: {
    tenantId: v.id("tenants"),
    query: v.string(),
  },
  returns: v.array(v.string()),
  handler: async (ctx, args) => {
    // TODO: Business logic to query RAG
    throw new Error("Not implemented");
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