import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth-page-shell";
import { Auth } from "@/components/ui/auth-form-1";
import { authViews } from "@/lib/auth-views";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify the email address for your Akkio account.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackURL?: string;
    email?: string;
    token?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <AuthPageShell>
      <Auth
        callbackURL={params.callbackURL ?? null}
        defaultEmail={params.email ?? null}
        defaultView={authViews.VERIFY_EMAIL}
        verificationToken={params.token ?? null}
      />
    </AuthPageShell>
  );
}
