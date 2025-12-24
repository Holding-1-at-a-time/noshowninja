import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// TODO: Implement Twilio webhook signature verification
function verifyTwilioSignature(request: NextRequest): boolean {
  // Placeholder for signature verification
  return true;
}

const twilioWebhookSchema = z.object({
  From: z.string(),
  To: z.string(),
  Body: z.string(),
  MessageSid: z.string(),
  // Add other Twilio fields as needed
});

export async function POST(request: NextRequest) {
  try {
    // Verify Twilio signature (placeholder)
    if (!verifyTwilioSignature(request)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = twilioWebhookSchema.parse(body);

    // TODO: Call Convex action to handle inbound SMS
    // await convex.action("messaging:handleInboundSms", validatedData);

    return NextResponse.json({ ok: true, stub: true });
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Example curl command:
// curl -X POST http://localhost:3000/api/twilio/webhook \
//   -H "Content-Type: application/json" \
//   -d '{"From":"+1234567890","To":"+0987654321","Body":"Hello","MessageSid":"SM123"}'