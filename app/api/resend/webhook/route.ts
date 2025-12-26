import { NextRequest, NextResponse } from "next/server";
import { v } from "convex/values";
import { z } from "zod";
import { action } from "@/convex/_generated/server";
import crypto from "crypto";
import { verifyToken } from "@clerk/nextjs/server";

// Convex-style validator for Resend webhook args
export const resendWebhookFields = {
  event: v.string(),
  email: v.string(),
  messageId: v.string(),
  // Add other Resend fields as needed
};

// Zod for advanced validation (e.g., email format)
const resendWebhookZod = z.object({
  event: z.string().min(1),
  email: z.string().email(),
  messageId: z.string().min(5),
});

/**
 * Validate a Clerk JWT using Clerk's server-side token verification.
 */
export async function validateClerkJWT(jwt: string): Promise<boolean> {
  try {
    await verifyToken(jwt);
    return true;
  } catch {
    return false;
  }
}
/**
 * Verifies the Resend signature using a raw request body and HMAC-SHA256.
 *
 * @param rawBody - Raw request body string
 * @param signature - Signature from the 'x-resend-signature' header
 * @param secret - Shared secret used to compute the HMAC
 * @returns true if the signature is valid, false otherwise
 */
export function verifyResendSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) {
    return false;
  }
  const hash = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return signature === hash;
}
/**
 * Handle Resend webhook events. Best practice: enforce tenant isolation, never log secrets.
 *
 * @param {NextRequest} request - Request object from Next.js
 *
 * @returns {Promise<NextResponse>} - Response object from Next.js
 *
 * @throws {NextResponse} - 401 if invalid Clerk JWT, 401 if invalid Resend signature, 400 if unexpected property, 400 if failed advanced validation, 500 if internal server error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Clerk JWT validation
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }
    const jwt = authHeader.replace("Bearer ", "");
    const clerkValid = await validateClerkJWT(jwt);
    if (!clerkValid) {
      return NextResponse.json({ error: "Invalid Clerk JWT" }, { status: 401 });
    }

    const secret = process.env.RESEND_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Missing Resend secret" }, { status: 500 });
    }
    const signature = request.headers.get("x-resend-signature");
    const rawBody = await request.text();
    if (!verifyResendSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    // Convex-style validation: only allow declared fields
    const allowedKeys = Object.keys(resendWebhookFields);
    for (const key of Object.keys(body)) {
      if (!allowedKeys.includes(key)) {
        return NextResponse.json({ error: `Unexpected property: ${key}` }, { status: 400 });
      }
    }
    // Zod advanced validation
    const zodResult = resendWebhookZod.safeParse(body);
    if (!zodResult.success) {
      return NextResponse.json({ error: "Failed advanced validation", details: zodResult.error }, { status: 400 });
    }

    // Call Convex action to handle inbound Resend event
    const { email, messageId, event } = zodResult.data;
    await action("messaging:handleInboundResend", { email, messageId, event });


    return NextResponse.json({ ok: true, stub: true });
  } catch (error) {
    console.error("Resend webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
