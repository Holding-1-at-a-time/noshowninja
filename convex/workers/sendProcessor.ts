import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * processSendTask
 * Worker that processes queued messageEvents. Best practice: enforce tenant isolation, never log secrets.
 */
export const processSendTask = action({
  args: {
    eventId: v.id("messageEvents"),
    tenantId: v.id("tenants"),
    channel: v.string(),
    contactId: v.id("contacts"),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    // Resolve contact
    const contact = await ctx.db.get(args.contactId);
    if (!contact) {
      await ctx.db.patch(args.eventId, { status: "failed", raw: { reason: "contact_not_found" } });
      return { ok: false };
    }
    try {
      // TODO: Integrate with Twilio/Resend provider APIs
      // For now, simulate success
      await ctx.db.patch(args.eventId, { status: "sent", raw: { note: "simulated send" } });
      return { ok: true };
    } catch (err) {
      await ctx.db.patch(args.eventId, { status: "failed", raw: { error: String(err) } });
      return { ok: false, error: String(err) };
    }
  },
});
