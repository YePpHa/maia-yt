import { LoggerLevel } from "./LoggerLevel";

export interface ILogger {
  log(level: LoggerLevel, message: any, ...args: any[]): void;
}