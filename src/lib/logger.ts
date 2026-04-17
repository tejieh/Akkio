type LogLevel = "info" | "warn" | "error";

type LogValue = boolean | number | string | null | undefined;

type LogPayload = Record<string, LogValue>;

function serialize(level: LogLevel, event: string, payload: LogPayload = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...payload,
  });
}

function emit(level: LogLevel, event: string, payload?: LogPayload) {
  const line = serialize(level, event, payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.info(line);
}

export const logger = {
  info(event: string, payload?: LogPayload) {
    emit("info", event, payload);
  },
  warn(event: string, payload?: LogPayload) {
    emit("warn", event, payload);
  },
  error(event: string, payload?: LogPayload) {
    emit("error", event, payload);
  },
};

export function getRequestId(request: Request) {
  return request.headers.get("x-request-id") ?? crypto.randomUUID();
}
