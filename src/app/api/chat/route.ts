import { createOpenAI, openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import type { JSONSchema7 } from "json-schema";
import { z } from "zod";
import { getAuth, isAuthConfigured } from "@/lib/auth";
import { createScopedComposioSessionForUser } from "@/lib/composio/server";
import {
  getOpenAIEnv,
  getWorkersAIEnv,
  isAIConfigured,
  isComposioConfigured,
} from "@/lib/env";
import { getRequestId, logger } from "@/lib/logger";

export const maxDuration = 30;
export const runtime = "nodejs";

const defaultWorkersAIModel = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

const chatRequestSchema = z.object({
  config: z
    .object({
      modelName: z.string().trim().min(1).optional(),
    })
    .optional(),
  messages: z.array(
    z
      .object({
        id: z.string(),
        role: z.enum(["system", "user", "assistant", "tool"]),
        parts: z.array(z.object({}).passthrough()),
      })
      .passthrough(),
  ),
  system: z.string().optional(),
  tools: z
    .record(
      z.string(),
      z.object({
        description: z.string().optional(),
        parameters: z.object({}).passthrough(),
      }),
    )
    .optional()
    .default({}),
});

const systemPrompt = `
You are Akkio, a multi-tenant SaaS automation assistant.

Security rules:
- Every tool you can access is already scoped to the currently authenticated Akkio user.
- Never claim access to data, connections, or workspaces outside the current user session.
- Only Gmail, GitHub, Google Calendar, and Notion integrations are available.
- If the required integration is disconnected, tell the user to connect it from the Integrations page.

Execution rules:
- Prefer tools over guessing when the user asks for live account data or actions.
- Before a write, edit, or execute action, briefly state the next step in plain language.
- After tool calls finish, summarize what changed or what you found.
`.trim();

function resolveModel(
  requestedModelName: string | undefined,
  entityId: string,
) {
  const openAIEnv = getOpenAIEnv();

  if (openAIEnv) {
    return {
      model: openai(requestedModelName ?? openAIEnv.model),
      providerOptions: {
        openai: {
          reasoningEffort: "medium" as const,
          reasoningSummary: "auto" as const,
          safetyIdentifier: entityId,
          textVerbosity: "low" as const,
        },
      },
    };
  }

  const workersAIEnv = getWorkersAIEnv();

  if (!workersAIEnv) {
    return null;
  }

  const cloudflare = createOpenAI({
    baseURL: `https://api.cloudflare.com/client/v4/accounts/${workersAIEnv.accountId}/ai/v1`,
    apiKey: workersAIEnv.apiToken,
  });

  return {
    model: cloudflare.chat(defaultWorkersAIModel),
    providerOptions: undefined,
  };
}

export async function POST(req: Request) {
  const requestId = getRequestId(req);

  if (!isAuthConfigured) {
    return Response.json(
      { error: "Authentication is not configured." },
      { status: 503 },
    );
  }

  if (!isComposioConfigured) {
    return Response.json(
      { error: "Composio is not configured.", requestId },
      { status: 503 },
    );
  }

  if (!isAIConfigured) {
    logger.error("chat.request.failed", {
      requestId,
      authRoute: "/api/chat",
      errorCode: "ai_not_configured",
    });

    return Response.json(
      { error: "No AI provider is configured.", requestId },
      { status: 503 },
    );
  }

  try {
    const session = await getAuth().api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return Response.json(
        { error: "Unauthorized", requestId },
        { status: 401 },
      );
    }

    const body = chatRequestSchema.parse(await req.json());
    const composioSession = await createScopedComposioSessionForUser(
      session.user.id,
    );
    const resolvedModel = resolveModel(
      body.config?.modelName,
      composioSession.entityId,
    );

    if (!resolvedModel) {
      return Response.json(
        { error: "No AI provider is configured.", requestId },
        { status: 503 },
      );
    }

    const composioTools = await composioSession.session.tools();
    const result = streamText({
      model: resolvedModel.model,
      system: body.system ? `${systemPrompt}\n\n${body.system}` : systemPrompt,
      messages: await convertToModelMessages(
        body.messages as unknown as UIMessage[],
      ),
      providerOptions: resolvedModel.providerOptions,
      stopWhen: stepCountIs(10),
      tools: {
        ...frontendTools(
          body.tools as Record<
            string,
            {
              description?: string;
              parameters: JSONSchema7;
            }
          >,
        ),
        ...composioTools,
      },
    });

    logger.info("chat.request.accepted", {
      requestId,
      userId: session.user.id,
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "x-request-id": requestId,
      },
      messageMetadata: ({ part }) => {
        if (part.type === "finish") {
          return {
            usage: part.totalUsage,
          };
        }

        if (part.type === "finish-step") {
          return {
            modelId: part.response.modelId,
          };
        }

        return undefined;
      },
      sendReasoning: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn("chat.request.invalid", {
        requestId,
        errorCode: "invalid_body",
      });

      return Response.json(
        {
          error: "Invalid request payload.",
          requestId,
        },
        { status: 400 },
      );
    }

    logger.error("chat.request.failed", {
      requestId,
      errorCode: error instanceof Error ? error.name : "unknown_error",
    });

    return Response.json(
      {
        error: "Unable to process chat request.",
        requestId,
      },
      { status: 500 },
    );
  }
}
