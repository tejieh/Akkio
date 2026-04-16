import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import type { UIMessage } from "ai";
import type { JSONSchema7 } from "json-schema";

export const maxDuration = 30;
export const runtime = "edge";

export async function POST(req: Request) {
  const {
    messages,
    tools,
  }: {
    messages: UIMessage[];
    tools: Record<
      string,
      {
        description?: string;
        parameters: JSONSchema7;
      }
    >;
  } = await req.json();

  const cloudflare = createOpenAI({
    baseURL: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
    apiKey: process.env.CLOUDFLARE_API_TOKEN,
  });

  const result = streamText({
    model: cloudflare.chat("@cf/meta/llama-3.3-70b-instruct-fp8-fast"),
    messages: await convertToModelMessages(messages),
    tools: {
      ...frontendTools(tools ?? {}),
    },
  });

  return result.toUIMessageStreamResponse();
}
