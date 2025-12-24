import { query, mutation } from "./_generated/server";
import { v } from "convex/values";


/**
 * getOrCreateTenant
 * Creates a tenant record if none exists for the given clerkOrgId.
 * Best practice: always enforce tenant isolation and never trust client-supplied tenant IDs.
 */
export const getOrCreateTenant = mutation({
  args: { clerkOrgId: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { clerkOrgId, name } = args;
    const existing = await ctx.db
      .query("tenants")
      .withIndex("by_clerkOrgId", (q) => q.eq("clerkOrgId", clerkOrgId))
      .first();
    if (existing) return existing;
    const now = Date.now();
    const id = await ctx.db.insert("tenants", {
      clerkOrgId,
      name: name || `Tenant ${clerkOrgId}`,
      createdAt: now,
    });
    return { id, clerkOrgId, name: name || null, createdAt: now };
  },
});


/**
 * validateTenantAccess
 * Validate that a user has access to a tenant. Returns true or throws.
 * Best practice: always check both user and tenant linkage.
 */
export const validateTenantAccess = query({
  args: { tenantId: v.id("tenants"), userId: v.id("users") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const { tenantId, userId } = args;
    const user = await ctx.db
      .query("users")
      .withIndex("by_id_tenantId", (q) =>
        q.eq("_id", userId).eq("tenantId", tenantId)
      )
      .filter((u) => u._id === userId)
      .first();
    if (!user) throw new Error("forbidden");
    return true;
  },
});