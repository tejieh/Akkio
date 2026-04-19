import { z } from "zod";
import { NextRequest } from "next/server";
import { composioIntegrationIds } from "@/lib/composio/constants";
import { deleteComposioConnectionForUser } from "@/lib/composio/server";
import { getAuth, isAuthConfigured } from "@/lib/auth";
import { isComposioConfigured } from "@/lib/env";
import { getRequestId, logger } from "@/lib/logger";

export const runtime = "nodejs";

const disconnectRequestSchema = z.object({
  integrationId: z.enum(composioIntegrationIds),
});

export async function POST(request: NextRequest) {
  const requestId = getRequestId(request);

  if (!isAuthConfigured) {
    return Response.json(
      { error: "Authentication is not configured.", requestId },
      { status: 503 },
    );
  }

  if (!isComposioConfigured) {
    return Response.json(
      { error: "Composio is not configured.", requestId },
      { status: 503 },
    );
  }

  try {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return Response.json(
        { error: "Unauthorized", requestId },
        { status: 401 },
      );
    }

    const body = disconnectRequestSchema.parse(await request.json());
    const disconnected = await deleteComposioConnectionForUser(
      session.user.id,
      body.integrationId,
    );

    logger.info("composio.disconnect.completed", {
      requestId,
      userId: session.user.id,
      integrationId: body.integrationId,
    });

    return Response.json({
      disconnected,
      requestId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid request payload.", requestId },
        { status: 400 },
      );
    }

    logger.error("composio.disconnect.failed", {
      requestId,
      errorCode: error instanceof Error ? error.name : "unknown_error",
    });

    return Response.json(
      { error: "Unable to disconnect the integration.", requestId },
      { status: 500 },
    );
  }
}
