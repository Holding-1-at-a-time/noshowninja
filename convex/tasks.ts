import { action, mutation } from "./_generated/server";
import { v } from "convex/values";

// TODO: Implement enqueueSend - enqueue message send task
export const enqueueSend = mutation({
  args: {
    tenantId: v.id("tenants"),
    scheduledMessageId: v.id("scheduledMessages"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // TODO: Business logic to enqueue send task
    throw new Error("Not implemented");
  },
});

// TODO: Implement processWorkpool - process tasks from workpool
export const processWorkpool = action({
  args: {
    tenantId: v.id("tenants"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // TODO: Business logic to process workpool
    throw new Error("Not implemented");
  },
});