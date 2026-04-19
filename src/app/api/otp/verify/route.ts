import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/server/db/prisma";
import { isAuthConfigured } from "@/lib/env";

const OTP_IDENTIFIER_PREFIX = "signup-otp:";

export async function POST(request: NextRequest) {
  if (!isAuthConfigured) {
    return NextResponse.json(
      { error: "Auth not configured." },
      { status: 503 },
    );
  }

  let email: string;
  let code: string;

  try {
    const body = await request.json();
    email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    code = typeof body.code === "string" ? body.code.trim() : "";
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required." },
      { status: 400 },
    );
  }

  const prisma = getPrisma();
  const identifier = `${OTP_IDENTIFIER_PREFIX}${email}`;

  const otp = await prisma.auth_verifications.findFirst({
    where: { identifier },
  });

  const invalid = !otp || otp.value !== code || otp.expiresAt < new Date();

  if (invalid) {
    return NextResponse.json(
      { error: "Invalid or expired code." },
      { status: 400 },
    );
  }

  // Mark email as verified and clean up the OTP
  await prisma.$transaction([
    prisma.auth_users.update({
      where: { email },
      data: { emailVerified: true },
    }),
    prisma.auth_verifications.delete({ where: { id: otp.id } }),
  ]);

  return NextResponse.json({ success: true });
}
