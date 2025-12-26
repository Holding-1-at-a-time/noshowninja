import { GenericId, v } from "convex/values";
import { action, mutation } from "../_generated/server";
import twilio from "twilio";


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
    content: v.string(),
  },
  /**
   * Handler for processing queued messageEvents. Best practice: enforce tenant isolation, never log secrets.
   *
   * Resolves the contact associated with the messageEvent and retrieves the provider config from the tenants table.
   * Creates a Twilio client using the provider config and sends a message to the contact's phone number.
   * Updates the messageEvent with a status of "sent" and a raw note containing the channel used.
   * Catches any errors and updates the messageEvent with a status of "failed" and a raw error string.
   * Returns an object with an "ok" boolean indicating success, and an optional "error" string containing the error message if "ok" is false.
   */
  handler: async (ctx: { db: { get: (arg0: GenericId<"tenants"> | GenericId<"contacts">) => any; patch: (arg0: GenericId<"messageEvents">, arg1: { status: string; raw: { note: string; } | { reason: string; } | { error: string; }; }) => any; }; }, args: { contactId: any; eventId: any; tenantId: any; channel: string; content: any; }) => {
    // Resolve contact
    const contact = await ctx.db.get(args.contactId);
    if (!contact) {
      await ctx.db.patch(args.eventId, { status: "failed", raw: { reason: "contact_not_found" } });
      return { ok: false };
    }
    try {
      // Get provider config from tenants table
      const tenant = await ctx.db.get(args.tenantId);
      if (!tenant) {
        throw new Error(`Tenant not found for tenantId ${args.tenantId}`);
      }
      const providerConfig = tenant.providerConfigs.find((pc: { channel: string; }) => pc.channel === args.channel);
      if (!providerConfig) {
        throw new Error(`No provider config found for channel ${args.channel}`);
      }

      // Create Twilio client
      const client = new twilio(
        providerConfig.accountSid,
        providerConfig.authToken
      );

      // Send message
      const message = await client.messages
        .create({
          from: providerConfig.fromNumber,
          to: contact.phone,
          body: args.content,
        });

      // Update messageEvent with status "sent" and raw note
      await ctx.db.patch(args.eventId, { status: "sent", raw: { note: `Message sent via ${args.channel}` } });
      return { ok: true };
    } catch (err) {
      // Update messageEvent with status "failed" and raw error string
      await ctx.db.patch(args.eventId, { status: "failed", raw: { error: String(err) } });
      return { ok: false, error: String(err) };
    }
  },
});