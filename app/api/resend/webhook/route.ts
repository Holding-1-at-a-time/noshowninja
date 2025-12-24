import { NextRequest, NextResponse } from "next/server";

// TODO: Implement Resend webhook signature verification
function verifyResendSignature(request: NextRequest): boolean {
  // Placeholder for signature verification
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Verify Resend signature (placeholder)
    if (!verifyResendSignature(request)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = await request.json();

    // TODO: Validate and process email event
    // Expected fields: type, data.id, data.to, data.from, etc.

    // TODO: Call Convex action to record email event
    // await convex.action("messaging:recordEmailEvent", validatedData);

    return NextResponse.json({ ok: true, stub: true });
  } catch (error) {
    console.error("Resend webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}