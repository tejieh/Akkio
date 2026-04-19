import { z } from "zod";
import { NextRequest } from "next/server";
import {
  composioIntegrationIds,
  type ComposioIntegrationId,
} from "@/lib/composio/constants";
import { createComposioConnectLinkForUser } from "@/lib/composio/server";
import { getAuth, isAuthConfigured } from "@/lib/auth";
import { isComposioConfigured } from "@/lib/env";
import { getRequestId, logger } from "@/lib/logger";

export const runtime = "nodejs";

const connectRequestSchema = z.object({
  integrationId: z.enum(composioIntegrationIds),
});

function createCallbackUrl(
  request: NextRequest,
  integrationId: ComposioIntegrationId,
) {
  const callbackUrl = new URL("/integrations", request.nextUrl.origin);
  callbackUrl.searchParams.set("integration", integrationId);

  return callbackUrl.toString();
}

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

    const body = connectRequestSchema.parse(await request.json());
    const redirectUrl = await createComposioConnectLinkForUser(
      session.user.id,
      body.integrationId,
      createCallbackUrl(request, body.integrationId),
    );

    logger.info("composio.connect.created", {
      requestId,
      userId: session.user.id,
      integrationId: body.integrationId,
    });

    return Response.json({
      redirectUrl,
      requestId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid request payload.", requestId },
        { status: 400 },
      );
    }

    logger.error("composio.connect.failed", {
      requestId,
      errorCode: error instanceof Error ? error.name : "unknown_error",
    });

    return Response.json(
      { error: "Unable to create a connection link.", requestId },
      { status: 500 },
    );
  }
}
