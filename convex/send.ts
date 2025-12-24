import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * sendMessage
 * Enqueue a message event for processing by workpool. Best practice: enforce tenant isolation.
 */
export const sendMessage = action({
  args: {
    tenantId: v.id("tenants"),
    channel: v.string(), // "sms" | "email"
    contactId: v.id("contacts"),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const eventId = await ctx.db.insert("messageEvents", {
      tenantId: args.tenantId,
      scheduledMessageId: undefined,
      provider: args.channel === "sms" ? "twilio" : "resend",
      status: "queued",
      raw: { content: args.content },
      createdAt: now,
    });
    // Optionally enqueue a workpool task here
    return { eventId };
  },
});
