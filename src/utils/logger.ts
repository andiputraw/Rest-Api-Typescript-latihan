import winston, { format } from "winston";
import infoLog from "../types/log.type";
import { Request } from "express";

const { combine, timestamp, label, prettyPrint } = format;

const logger = winston.createLogger({
  format: combine(timestamp(), prettyPrint()),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.File({ filename: "log/combined.log" })],
});

export async function createLog(level: "info" | "error" | "warn", message: string) {
  await logger.log({
    level: level,
    message: message,
  });
}

export async function createLogInfo(level: "info" | "error" | "warn", message: string, info: infoLog) {
  await logger.log({
    level: level,
    message: message,
    ip: info.ip,
    method: info.method,
    url: info.url,
    info: info.failed ? JSON.stringify(info.failed) : info.failed,
  });
}

export function newInfoLog(req: Request, failed: any = "") {
  return { ip: req.ip, method: req.method, url: req.originalUrl, failed };
}
