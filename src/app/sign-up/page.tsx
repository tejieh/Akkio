import { Auth, AuthView } from "@/components/ui/auth-form-1";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:border-r lg:border-border">
        <Auth defaultView={AuthView.SIGN_UP} className="w-full max-w-md" />
      </div>
      <div className="w-1/2 relative hidden lg:block bg-white">
      </div>
    </div>
  );
}
