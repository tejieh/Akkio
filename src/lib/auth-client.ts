"use client";

import { createAuthClient } from "better-auth/react";
import type { BetterFetchError } from "@better-fetch/fetch";

export const authClient = createAuthClient();

type AuthClientError =
  | BetterFetchError
  | {
      message?: string;
      status?: number;
      statusText?: string;
    }
  | null
  | undefined;

export function getAuthErrorStatus(error: AuthClientError) {
  if (!error) {
    return null;
  }

  return typeof error.status === "number" ? error.status : null;
}

export function isRateLimitError(error: AuthClientError) {
  return getAuthErrorStatus(error) === 429;
}

export function getAuthErrorMessage(
  error: AuthClientError,
  fallbackMessage: string,
) {
  if (isRateLimitError(error)) {
    return "Too many attempts. Wait a minute and try again.";
  }

  if (!error) {
    return fallbackMessage;
  }

  if (error.message) {
    return error.message;
  }

  if (error.statusText) {
    return error.statusText;
  }

  return fallbackMessage;
}

function createAuthEndpointError(
  status: number,
  statusText: string,
  payload: unknown,
) {
  const message =
    typeof payload === "object" && payload !== null
      ? "message" in payload && typeof payload.message === "string"
        ? payload.message
        : "error" in payload && typeof payload.error === "string"
          ? payload.error
          : undefined
      : undefined;

  const error = new Error(
    message || statusText || "Authentication request failed.",
  ) as Error & {
    status: number;
    statusText: string;
  };

  error.status = status;
  error.statusText = statusText;
  return error;
}

export async function authEndpointRequest<T>({
  body,
  method,
  path,
  query,
}: {
  body?: unknown;
  method: "GET" | "POST";
  path: string;
  query?: Record<string, string | undefined>;
}) {
  const url = new URL(`/api/auth${path}`, window.location.origin);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    method,
    credentials: "include",
    headers: body
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    throw createAuthEndpointError(
      response.status,
      response.statusText,
      payload,
    );
  }

  return {
    data: payload as T,
    redirectedTo: response.redirected ? response.url : null,
  };
}
