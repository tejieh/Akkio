import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth-page-shell";
import { Auth } from "@/components/ui/auth-form-1";
import { authViews } from "@/lib/auth-views";
import { redirectAuthenticatedUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Akkio account.",
};

export default async function SignUpPage() {
  await redirectAuthenticatedUser();

  return (
    <AuthPageShell>
      <Auth defaultView={authViews.SIGN_UP} />
    </AuthPageShell>
  );
}
