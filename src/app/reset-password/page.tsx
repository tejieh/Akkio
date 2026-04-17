import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth-page-shell";
import { Auth } from "@/components/ui/auth-form-1";
import { authViews } from "@/lib/auth-views";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Akkio account password.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackURL?: string;
    token?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <AuthPageShell>
      <Auth
        callbackURL={params.callbackURL ?? null}
        defaultView={authViews.RESET_PASSWORD}
        resetToken={params.token ?? null}
      />
    </AuthPageShell>
  );
}
