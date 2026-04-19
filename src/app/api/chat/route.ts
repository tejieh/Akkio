import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import type { UIMessage } from "ai";
import type { JSONSchema7 } from "json-schema";
import { z } from "zod";
import { getAuth, isAuthConfigured } from "@/lib/auth";
import { getWorkersAIEnv, isWorkersAIConfigured } from "@/lib/env";
import { getRequestId, logger } from "@/lib/logger";

export const maxDuration = 30;
export const runtime = "nodejs";

const chatRequestSchema = z.object({
  messages: z.array(
    z
      .object({
        id: z.string(),
        role: z.enum(["system", "user", "assistant", "tool"]),
        parts: z.array(z.object({}).passthrough()),
      })
      .passthrough(),
  ),
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

export async function POST(req: Request) {
  const requestId = getRequestId(req);

  if (!isAuthConfigured) {
    return Response.json(
      { error: "Authentication is not configured." },
      { status: 503 },
    );
  }

  if (!isWorkersAIConfigured) {
    logger.error("chat.request.failed", {
      requestId,
      authRoute: "/api/chat",
      errorCode: "workers_ai_not_configured",
    });
    return Response.json(
      { error: "Workers AI is not configured.", requestId },
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
    const workersAIEnv = getWorkersAIEnv();

    if (!workersAIEnv) {
      return Response.json(
        { error: "Workers AI is not configured.", requestId },
        { status: 503 },
      );
    }

    const cloudflare = createOpenAI({
      baseURL: `https://api.cloudflare.com/client/v4/accounts/${workersAIEnv.accountId}/ai/v1`,
      apiKey: workersAIEnv.apiToken,
    });

    const result = streamText({
      model: cloudflare.chat("@cf/meta/llama-3.3-70b-instruct-fp8-fast"),
      messages: await convertToModelMessages(
        body.messages as unknown as UIMessage[],
      ),
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
