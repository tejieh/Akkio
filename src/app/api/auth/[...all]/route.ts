import { toNextJsHandler } from "better-auth/next-js";
import { auth, isAuthConfigured } from "@/lib/auth";

const handler = toNextJsHandler(auth);

function authNotConfiguredResponse() {
  return Response.json(
    {
      message:
        "Authentication is not configured yet. Set DATABASE_URL and BETTER_AUTH_* environment variables.",
    },
    { status: 503 },
  );
}

export async function GET(request: Request) {
  return isAuthConfigured ? handler.GET(request) : authNotConfiguredResponse();
}

export async function POST(request: Request) {
  return isAuthConfigured ? handler.POST(request) : authNotConfiguredResponse();
}

export async function PATCH(request: Request) {
  return isAuthConfigured ? handler.PATCH(request) : authNotConfiguredResponse();
}

export async function PUT(request: Request) {
  return isAuthConfigured ? handler.PUT(request) : authNotConfiguredResponse();
}

export async function DELETE(request: Request) {
  return isAuthConfigured ? handler.DELETE(request) : authNotConfiguredResponse();
}
