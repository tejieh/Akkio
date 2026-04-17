"use client";

import { Thread } from "@/components/assistant-ui/thread";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { UserMenu } from "@/components/user-menu";

interface ChatViewProps {
  user: {
    email: string;
    image?: string | null;
    name?: string | null;
  };
}

export function ChatView({ user }: ChatViewProps) {
  const runtime = useChatRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="relative h-dvh w-full">
        <div className="absolute top-4 right-4 z-10">
          <UserMenu email={user.email} image={user.image} name={user.name} />
        </div>
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
}
