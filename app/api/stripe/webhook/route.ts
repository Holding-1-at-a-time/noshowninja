import { NextRequest, NextResponse } from "next/server";
import { v } from "convex/values";
import { z } from "zod";

// Convex-style validator for Stripe webhook args
export const stripeWebhookFields = {
  type: v.string(),
  data: v.any(),
  id: v.string(),
  // Add other Stripe fields as needed
};

// Zod for advanced validation (e.g., event type format)
const stripeWebhookZod = z.object({
  type: z.string().min(1),
  data: z.any(),
  id: z.string().min(5),
});

function verifyStripeSignature(request: NextRequest): boolean {
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

    // Verify Stripe signature (placeholder)
    if (!verifyStripeSignature(request)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = await request.json();
    // Convex-style validation: only allow declared fields
    const allowedKeys = Object.keys(stripeWebhookFields);
    for (const key of Object.keys(body)) {
      if (!allowedKeys.includes(key)) {
        return NextResponse.json({ error: `Unexpected property: ${key}` }, { status: 400 });
      }
    }

    // Zod advanced validation
    const zodResult = stripeWebhookZod.safeParse(body);
    if (!zodResult.success) {
      return NextResponse.json({ error: "Failed advanced validation", details: zodResult.error }, { status: 400 });
    }

    // TODO: Call Convex action to handle inbound Stripe event
    // await convex.action("billing:handleStripeWebhook", body);

    return NextResponse.json({ ok: true, stub: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}