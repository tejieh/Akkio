import type { Metadata } from "next";
import { ChatView } from "@/app/chat/chat-view";
import { requireServerSession } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Chat",
  description: "Authenticated chat workspace.",
};

export default async function ChatPage() {
  const session = await requireServerSession();

  return (
    <ChatView
      user={{
        email: session.user.email,
        image: session.user.image,
        name: session.user.name,
      }}
    />
  );
}
