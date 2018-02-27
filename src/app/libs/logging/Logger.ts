import { ILogger } from './ILogger';
import { LoggerLevel } from "./LoggerLevel";
import { sprintf } from 'sprintf-js';

export class Logger implements ILogger {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  log(level: LoggerLevel, message: string, ...args: any[]): void {
    let msg: string = sprintf(message, ...args);
    if (this._name) {
      msg = "[" + this._name + "] " + msg;
    }

    switch (level) {
      case LoggerLevel.EMERGENCY:
      case LoggerLevel.ALERT:
      case LoggerLevel.CRITICAL:
      case LoggerLevel.ERROR:
        console.error(msg);
        break;
      case LoggerLevel.WARNING:
        console.warn(msg);
        break;
      case LoggerLevel.NOTICE:
      case LoggerLevel.INFO:
        console.log(msg);
        break;
      case LoggerLevel.DEBUG:
        console.debug(msg);
        break;
    }
  }
  
  error(message: string, ...args: any[]): void {
    this.log(LoggerLevel.ERROR, message, ...args);
  }
    
  warning(message: string, ...args: any[]): void {
    this.log(LoggerLevel.WARNING, message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.log(LoggerLevel.INFO, message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.log(LoggerLevel.DEBUG, message, ...args);
  }
}