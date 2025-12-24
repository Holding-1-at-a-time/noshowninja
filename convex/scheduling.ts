import { mutation } from "./_generated/server";
import { v } from "convex/values";

// TODO: Implement scheduleMessage - schedule a message for sending
export const scheduleMessage = mutation({
  args: {
    tenantId: v.id("tenants"),
    contactId: v.id("contacts"),
    templateId: v.id("templates"),
    scheduledAt: v.number(),
  },
  returns: v.id("scheduledMessages"),
  handler: async (ctx, args) => {
    // TODO: Business logic to schedule message
    throw new Error("Not implemented");
  },
});

// TODO: Implement cancelScheduledMessage - cancel a scheduled message
export const cancelScheduledMessage = mutation({
  args: {
    tenantId: v.id("tenants"),
    scheduledMessageId: v.id("scheduledMessages"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // TODO: Business logic to cancel scheduled message
    throw new Error("Not implemented");
  },
});