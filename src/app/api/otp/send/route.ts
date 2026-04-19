import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/server/db/prisma";
import { sendOtpEmail } from "@/lib/email";
import { isAuthConfigured } from "@/lib/env";

const OTP_IDENTIFIER_PREFIX = "signup-otp:";
const OTP_TTL_MS = 60 * 60 * 1000; // 60 minutes

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  if (!isAuthConfigured) {
    return NextResponse.json(
      { error: "Auth not configured." },
      { status: 503 },
    );
  }

  let email: string;

  try {
    const body = await request.json();
    email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const prisma = getPrisma();
  const user = await prisma.auth_users.findUnique({ where: { email } });

  if (!user) {
    // Return 200 to avoid leaking whether an email is registered
    return NextResponse.json({ success: true });
  }

  if (user.emailVerified) {
    return NextResponse.json(
      { error: "Email is already verified." },
      { status: 400 },
    );
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  const identifier = `${OTP_IDENTIFIER_PREFIX}${email}`;

  // Replace any existing OTP for this email
  await prisma.auth_verifications.deleteMany({ where: { identifier } });
  await prisma.auth_verifications.create({
    data: {
      id: crypto.randomUUID(),
      identifier,
      value: code,
      expiresAt,
    },
  });

  await sendOtpEmail({ email, code, userId: user.id });

  return NextResponse.json({ success: true });
}
