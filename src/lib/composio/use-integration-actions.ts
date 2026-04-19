"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import type { ComposioIntegrationId } from "@/lib/composio/constants";

const connectResponseSchema = z.object({
  redirectUrl: z.string().url(),
  requestId: z.string(),
});

const disconnectResponseSchema = z.object({
  disconnected: z.boolean(),
  requestId: z.string(),
});

type IntegrationMutation = "connect" | "disconnect";

type EndpointError = Error & {
  requestId?: string;
};

function createEndpointError(payload: unknown, fallbackMessage: string) {
  const parsed = z
    .object({
      error: z.string().optional(),
      requestId: z.string().optional(),
    })
    .safeParse(payload);

  const error = new Error(
    parsed.success && parsed.data.error ? parsed.data.error : fallbackMessage,
  ) as EndpointError;

  if (parsed.success) {
    error.requestId = parsed.data.requestId;
  }

  return error;
}

async function postJson(path: string, integrationId: ComposioIntegrationId) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ integrationId }),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw createEndpointError(payload, "Integration request failed.");
  }

  return payload;
}

export function useComposioIntegrationActions() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    integrationId: ComposioIntegrationId;
    mutation: IntegrationMutation;
  } | null>(null);

  const connect = async (integrationId: ComposioIntegrationId) => {
    setError(null);
    setPendingAction({ integrationId, mutation: "connect" });

    try {
      const payload = connectResponseSchema.parse(
        await postJson("/api/composio/connect", integrationId),
      );

      window.location.assign(payload.redirectUrl);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to start the connection flow.";

      setError(message);
      setPendingAction(null);
      throw caughtError;
    }
  };

  const disconnect = async (integrationId: ComposioIntegrationId) => {
    setError(null);
    setPendingAction({ integrationId, mutation: "disconnect" });

    try {
      disconnectResponseSchema.parse(
        await postJson("/api/composio/disconnect", integrationId),
      );

      startTransition(() => {
        router.refresh();
      });
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to disconnect the integration.";

      setError(message);
      setPendingAction(null);
      throw caughtError;
    }
  };

  return {
    connect,
    disconnect,
    error,
    isPending: pendingAction !== null,
    pendingAction,
  };
}
