import { mutation } from "./_generated/server";
import { v } from "convex/values";


/**
 * scheduleMessage
 * Best practice: enforce tenant isolation and validate contact ownership.
 */
export const scheduleMessage = mutation({
  args: {
    tenantId: v.id("tenants"),
    contactId: v.id("contacts"),
    templateId: v.optional(v.id("templates")),
    payload: v.optional(v.any()),
    sendAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Optionally: validate contact ownership here
    const now = Date.now();
    const id = await ctx.db.insert("scheduledMessages", {
      tenantId: args.tenantId,
      contactId: args.contactId,
      workflowStepId: undefined,
      sendAt: args.sendAt,
      payload: args.payload,
      status: "scheduled",
      createdAt: now,
    });
    return { id };
  },
});


/**
 * cancelScheduledMessage
 * Best practice: enforce tenant isolation and only allow cancels by owner.
 */
export const cancelScheduledMessage = mutation({
  args: {
    scheduledMessageId: v.id("scheduledMessages"),
    tenantId: v.id("tenants"),
  },
  handler: async (ctx, args) => {
    const msg = await ctx.db.get(args.scheduledMessageId);
    if (!msg || msg.tenantId !== args.tenantId) throw new Error("forbidden");
    await ctx.db.patch(args.scheduledMessageId, { status: "cancelled" });
    return { ok: true };
  },
});