import winston, { format } from "winston";
import infoLog from "../types/log.type";
import { Request } from "express";

const { combine, timestamp, label, prettyPrint } = format;

const route = winston.createLogger({
  format: combine(timestamp(), prettyPrint()),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.File({ filename: "log/combined.log" })],
});

const serverLog = winston.createLogger({
  format: combine(timestamp(), prettyPrint()),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.File({ filename: "log/server.log" })],
});

/**
 * Create log for router tier
 * !! deprecated pls dont use
 * @param level log level
 * @param message log message
 */
export async function createLog(level: "info" | "error" | "warn", message: string) {
  route.log({
    level: level,
    message: message,
  });
}
/**
 * create detailed log for router tier
 * @param level log level
 * @param message log message
 * @param info log info
 */
export async function createServerLogInfo(level: "info" | "error" | "warn", message: string, info: infoLog) {
  serverLog.log({
    level: level,
    message: message,
    ip: info.ip,
    method: info.method,
    url: info.url,
    info: info.failed ? JSON.stringify(info.failed) : info.failed,
  });
}
/**
 * create detailed log for router tier
 * @param level log level
 * @param message log message
 * @param info log info
 */
export async function createLogInfo(level: "info" | "error" | "warn", message: string, info: infoLog) {
  route.log({
    level: level,
    message: message,
    ip: info.ip,
    method: info.method,
    url: info.url,
    info: info.failed ? JSON.stringify(info.failed) : info.failed,
  });
}
/**
 * create a new object, it used core createLogInfo function
 * @param req
 * @param failed failed if there's any error message
 *
 */
export function newInfoLog(req: Request, failed: any = "") {
  return { ip: req.ip, method: req.method, url: req.originalUrl, failed };
}
