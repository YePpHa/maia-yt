import { LoggerLevel } from "./LoggerLevel";

export interface ILogger {
  log(level: LoggerLevel, message: string, ...args: any[]): void;
}