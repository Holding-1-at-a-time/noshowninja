import { action, mutation } from "./_generated/server";
import { v } from "convex/values";

// TODO: Implement sendMessage - send message via provider
export const sendMessage = action({
  args: {
    tenantId: v.id("tenants"),
    scheduledMessageId: v.id("scheduledMessages"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // TODO: Business logic to send message
    throw new Error("Not implemented");
  },
});

// TODO: Implement recordProviderEvent - record event from provider webhook
export const recordProviderEvent = mutation({
  args: {
    tenantId: v.id("tenants"),
    scheduledMessageId: v.id("scheduledMessages"),
    eventType: v.string(),
    providerMessageId: v.optional(v.string()),
    timestamp: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // TODO: Business logic to record provider event
    throw new Error("Not implemented");
  },
});