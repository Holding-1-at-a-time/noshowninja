import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Convex-style validator for Twilio webhook args
import { v } from "convex/values";

export const twilioWebhookFields = {
  From: v.string(),
  To: v.string(),
  Body: v.string(),
  MessageSid: v.string(),
  // Add other Twilio fields as needed
};

// Zod for advanced validation (length, format, etc.)
import { z } from "zod";
const twilioWebhookZod = z.object({
  From: z.string().min(10),
  To: z.string().min(10),
  Body: z.string().min(1),
  MessageSid: z.string().min(5),
});

function verifyTwilioSignature(request: NextRequest): boolean {
  // Placeholder for signature verification
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Clerk JWT validation
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }
    const jwt = authHeader.replace("Bearer ", "");
    // TODO: Implement validateClerkJWT(jwt) helper
    // const clerkValid = await validateClerkJWT(jwt);
    // if (!clerkValid) {
    //   return NextResponse.json({ error: "Invalid Clerk JWT" }, { status: 401 });
    // }

    // Verify Twilio signature (placeholder)
    if (!verifyTwilioSignature(request)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = await request.json();
    // Convex-style validation: only allow declared fields
    const allowedKeys = Object.keys(twilioWebhookFields);
    for (const key of Object.keys(body)) {
      if (!allowedKeys.includes(key)) {
        return NextResponse.json({ error: `Unexpected property: ${key}` }, { status: 400 });
      }
    }

    // Zod advanced validation
    const zodResult = twilioWebhookZod.safeParse(body);
    if (!zodResult.success) {
      return NextResponse.json({ error: "Failed advanced validation", details: zodResult.error }, { status: 400 });
    }

    // TODO: Call Convex action to handle inbound SMS
    // await convex.action("messaging:handleInboundSms", body);

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