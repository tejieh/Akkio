"use client";

import { MessageSquareText, Sparkles } from "lucide-react";
import { Thread } from "@/components/assistant-ui/thread";
import { AkkioAssistantRuntimeProvider } from "@/components/assistant-ui/runtime-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function FloatingAssistant() {
  return (
    <div className="pointer-events-none fixed right-6 bottom-6 z-40">
      <Dialog>
        <DialogTrigger className="pointer-events-auto">
          <Button className="h-11 rounded-full px-4 shadow-lg">
            <Sparkles className="size-4" />
            Ask Akkio
          </Button>
        </DialogTrigger>
        <DialogContent
          className="pointer-events-auto w-[min(96vw,960px)] max-w-none gap-0 overflow-hidden p-0 sm:max-w-none"
          showCloseButton={false}
        >
          <DialogHeader className="border-b px-5 py-4">
            <DialogTitle className="flex items-center gap-2 text-sm">
              <MessageSquareText className="size-4" />
              Akkio Assistant
            </DialogTitle>
          </DialogHeader>
          <AkkioAssistantRuntimeProvider>
            <div className="h-[min(82vh,760px)]">
              <Thread />
            </div>
          </AkkioAssistantRuntimeProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}
