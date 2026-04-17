import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth, isAuthConfigured } from "@/lib/auth";

export async function getServerSession() {
  if (!isAuthConfigured) {
    return null;
  }

  return getAuth().api.getSession({
    headers: await headers(),
  });
}

export async function requireServerSession() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export async function redirectAuthenticatedUser() {
  const session = await getServerSession();

  if (session) {
    redirect("/chat");
  }
}
