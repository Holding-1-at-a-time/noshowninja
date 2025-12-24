import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


/**
 * createWorkflow
 * Best practice: always require tenantId and validate ownership before creating.
 */
export const createWorkflow = mutation({
  args: {
    tenantId: v.id("tenants"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Optionally: validate tenant ownership here
    const now = Date.now();
    const id = await ctx.db.insert("workflows", {
      tenantId: args.tenantId,
      name: args.name,
      description: args.description,
      createdAt: now,
    });
    return { id };
  },
});


/**
 * updateWorkflow
 * Best practice: enforce tenant isolation and only allow updates by owner.
 */
export const updateWorkflow = mutation({
  args: {
    tenantId: v.id("tenants"),
    workflowId: v.id("workflows"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const wf = await ctx.db.get(args.workflowId);
    if (!wf || wf.tenantId !== args.tenantId) throw new Error("forbidden");
    await ctx.db.patch(args.workflowId, {
      ...(args.name !== undefined ? { name: args.name } : {}),
      ...(args.description !== undefined ? { description: args.description } : {}),
    });
    return null;
  },
});


/**
 * deleteWorkflow
 * Best practice: enforce tenant isolation and only allow deletes by owner.
 */
export const deleteWorkflow = mutation({
  args: {
    tenantId: v.id("tenants"),
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, args) => {
    const wf = await ctx.db.get(args.workflowId);
    if (!wf || wf.tenantId !== args.tenantId) throw new Error("forbidden");
    await ctx.db.delete(args.workflowId);
    return null;
  },
});
/**
 * getWorkflow
 * Best practice: always check tenantId matches.
 */
export const getWorkflow = query({
  args: { workflowId: v.id("workflows"), tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    const wf = await ctx.db.get(args.workflowId);
    if (!wf || wf.tenantId !== args.tenantId) throw new Error("forbidden");
    return wf;
  },
});

// TODO: Implement getWorkflows - get all workflows for tenant
export const getWorkflows = query({
  args: {
    tenantId: v.id("tenants"),
  },
  returns: v.array(v.object({
    _id: v.id("workflows"),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    // TODO: Business logic to get workflows
    throw new Error("Not implemented");
  },
});