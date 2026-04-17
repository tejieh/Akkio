import { toNextJsHandler } from "better-auth/next-js";
import { getAuth, isAuthConfigured } from "@/lib/auth";
import { logger, getRequestId } from "@/lib/logger";

function authNotConfiguredResponse() {
  return Response.json(
    {
      message:
        "Authentication is not configured yet. Set DATABASE_URL and BETTER_AUTH_* environment variables.",
    },
    { status: 503 },
  );
}

function routeLabel(request: Request) {
  return new URL(request.url).pathname.replace("/api/auth", "") || "/";
}

async function handleAuthRequest(
  request: Request,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
) {
  if (!isAuthConfigured) {
    return authNotConfiguredResponse();
  }

  const requestId = getRequestId(request);
  const handler = toNextJsHandler(getAuth());

  try {
    const response = await handler[method](request);
    const authRoute = routeLabel(request);

    if (response.status >= 400) {
      const event =
        authRoute === "/sign-in/email"
          ? "auth.signin.failed"
          : authRoute === "/request-password-reset"
            ? "auth.password_reset_request.failed"
            : authRoute === "/send-verification-email"
              ? "auth.verification_email.failed"
              : "auth.route.failed";

      logger.warn(event, {
        requestId,
        authRoute,
        errorCode: String(response.status),
      });
    } else if (method === "POST") {
      if (authRoute === "/sign-up/email") {
        logger.info("auth.signup.completed", {
          requestId,
          authRoute,
        });
      }

      if (authRoute === "/request-password-reset") {
        logger.info("auth.password_reset_request.completed", {
          requestId,
          authRoute,
        });
      }

      if (authRoute === "/send-verification-email") {
        logger.info("auth.verification_email.requested", {
          requestId,
          authRoute,
        });
      }
    }

    const nextResponse = new Response(response.body, response);
    nextResponse.headers.set("x-request-id", requestId);
    return nextResponse;
  } catch (error) {
    logger.error("auth.route.exception", {
      requestId,
      authRoute: routeLabel(request),
      errorCode: error instanceof Error ? error.name : "unknown_error",
    });

    return Response.json(
      {
        message: "Authentication request failed.",
        requestId,
      },
      { status: 500 },
    );
  }
}

export function GET(request: Request) {
  return handleAuthRequest(request, "GET");
}

export function POST(request: Request) {
  return handleAuthRequest(request, "POST");
}

export function PATCH(request: Request) {
  return handleAuthRequest(request, "PATCH");
}

export function PUT(request: Request) {
  return handleAuthRequest(request, "PUT");
}

export function DELETE(request: Request) {
  return handleAuthRequest(request, "DELETE");
}
