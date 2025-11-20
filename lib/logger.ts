import pino from "pino";
import pinoHttp from "pino-http";

const isProd = process.env.NODE_ENV === "production";
const level = process.env.LOG_LEVEL || (isProd ? "info" : "debug");

// Use pino-pretty in development for readable console output
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

const logger = pino(transport ? { level, transport } : { level });

// pino-http helper for express-style middleware (if you use an express server)
const httpLogger = pinoHttp({ logger });

export { logger, httpLogger };
export default logger;
