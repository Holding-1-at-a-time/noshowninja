import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyResendSignature, validateClerkJWT } from "@/app/api/resend/webhook/route";

vi.mock("@clerk/nextjs/server", () => ({
  verifyToken: vi.fn(),
}));

describe("verifyResendSignature", () => {
  it("returns true for matching HMAC", () => {
    const secret = "test-secret";
    const body = JSON.stringify({ a: 1 });
    const crypto = require("crypto") as typeof import("crypto");
    const sig = crypto.createHmac("sha256", secret).update(body).digest("hex");
    expect(verifyResendSignature(body, sig, secret)).toBe(true);
  });

  it("returns false for missing signature", () => {
    expect(verifyResendSignature("{}", null, "secret")).toBe(false);
  });

  it("returns false for mismatched signature", () => {
    expect(verifyResendSignature("{}", "bad", "secret")).toBe(false);
  });
});

describe("validateClerkJWT", () => {
  const { verifyToken } = require("@clerk/nextjs/server") as { verifyToken: (t: string) => Promise<void> };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns true when Clerk verifies", async () => {
    verifyToken.mockResolvedValueOnce();
    await expect(validateClerkJWT("valid-jwt"))
      .resolves.toBe(true);
  });

  it("returns false when Clerk rejects", async () => {
    verifyToken.mockRejectedValueOnce(new Error("invalid"));
    await expect(validateClerkJWT("bad-jwt"))
      .resolves.toBe(false);
  });
});
