/* eslint-disable */
// logger helper that only loads pino on the server.
// This prevents bundlers from trying to evaluate pino in the browser
// which can cause runtime errors like "stringifySym" undefined.
const isServer = typeof window === "undefined";

type LoggerLike = {
  fatal: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  trace: (...args: unknown[]) => void;
  child: (opts?: unknown) => LoggerLike;
};

type HttpLogger = (...args: unknown[]) => unknown;

let logger: LoggerLike;
let httpLogger: HttpLogger;

if (isServer) {
  // Load server-only modules at runtime to avoid bundling them into client code
  const pino = require("pino");
  const pinoHttp = require("pino-http");

  const isProd = process.env.NODE_ENV === "production";
  const level = process.env.LOG_LEVEL || (isProd ? "info" : "debug");

  const transport = !isProd
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined;

  logger = pino(transport ? { level, transport } : { level });
  httpLogger = pinoHttp({ logger });
} else {
  // Client-side no-op logger to avoid errors when imported in shared modules
  const makeNoop = () => {
    const methods = [
      "fatal",
      "error",
      "warn",
      "info",
      "debug",
      "trace",
      "child",
    ];
    const obj = {} as LoggerLike;
    methods.forEach((m) => {
      if (m === "child") {
        obj.child = () => obj;
      } else {
        // @ts-expect-error dynamic assignment
        obj[m] = () => {
          // no-op on client; keep silent to avoid leaking PII to console
        };
      }
    });
    return obj;
  };

  logger = makeNoop();
  // httpLogger fallback: returns an express-style middleware that is a no-op
  httpLogger = () => (req: any, res: any, next?: any) => next && next();
}

export { logger, httpLogger };
export default logger;
