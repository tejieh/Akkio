import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth-page-shell";
import { Auth } from "@/components/ui/auth-form-1";
import { authViews } from "@/lib/auth-views";
import { redirectAuthenticatedUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset for your Akkio account.",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
  }>;
}) {
  const params = await searchParams;

  await redirectAuthenticatedUser();

  return (
    <AuthPageShell>
      <Auth
        defaultEmail={params.email ?? null}
        defaultView={authViews.FORGOT_PASSWORD}
      />
    </AuthPageShell>
  );
}
