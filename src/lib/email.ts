import { getAuthEmailEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

interface AuthEmailPayload {
  userId?: string;
  email: string;
  url: string;
}

function toFrontendUrl(authUrlString: string, pathname: string) {
  const authUrl = new URL(authUrlString);
  const frontendUrl = new URL(pathname, authUrl.origin);
  const token = authUrl.searchParams.get("token") ?? authUrl.pathname.split("/").at(-1);
  const callbackURL = authUrl.searchParams.get("callbackURL");

  if (token) {
    frontendUrl.searchParams.set("token", token);
  }

  if (callbackURL) {
    frontendUrl.searchParams.set("callbackURL", callbackURL);
  }

  return frontendUrl.toString();
}

async function sendEmail({
  subject,
  html,
  to,
}: {
  subject: string;
  html: string;
  to: string;
}) {
  const authEnv = getAuthEmailEnv();

  if (!authEnv) {
    throw new Error("Email delivery requires auth configuration.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authEnv.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: authEnv.from,
      to: [to],
      subject,
      html,
      reply_to: authEnv.replyTo,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend API request failed with status ${response.status}.`);
  }
}

export async function sendVerificationEmail(payload: AuthEmailPayload) {
  const verificationUrl = toFrontendUrl(payload.url, "/verify-email");

  try {
    await sendEmail({
      to: payload.email,
      subject: "Verify your Akkio account",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h1 style="font-size: 20px;">Verify your email</h1>
          <p>Confirm your email address to activate your Akkio account.</p>
          <p><a href="${verificationUrl}">Verify email</a></p>
          <p>If the button does not work, copy this URL into your browser:</p>
          <p>${verificationUrl}</p>
        </div>
      `,
    });

    logger.info("auth.verification_email.sent", {
      authRoute: "/send-verification-email",
      provider: "resend",
      userId: payload.userId,
    });
  } catch (error) {
    logger.error("auth.verification_email.failed", {
      authRoute: "/send-verification-email",
      provider: "resend",
      userId: payload.userId,
      errorCode: error instanceof Error ? error.message : "unknown_error",
    });
    throw error;
  }
}

export async function sendPasswordResetEmail(payload: AuthEmailPayload) {
  const resetUrl = toFrontendUrl(payload.url, "/reset-password");

  try {
    await sendEmail({
      to: payload.email,
      subject: "Reset your Akkio password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h1 style="font-size: 20px;">Reset your password</h1>
          <p>Use the link below to choose a new password for your Akkio account.</p>
          <p><a href="${resetUrl}">Reset password</a></p>
          <p>If the button does not work, copy this URL into your browser:</p>
          <p>${resetUrl}</p>
        </div>
      `,
    });

    logger.info("auth.password_reset_email.sent", {
      authRoute: "/request-password-reset",
      provider: "resend",
      userId: payload.userId,
    });
  } catch (error) {
    logger.error("auth.password_reset_email.failed", {
      authRoute: "/request-password-reset",
      provider: "resend",
      userId: payload.userId,
      errorCode: error instanceof Error ? error.message : "unknown_error",
    });
    throw error;
  }
}
