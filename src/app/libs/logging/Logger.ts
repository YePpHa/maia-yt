import { ILogger } from './ILogger';
import { LoggerLevel } from "./LoggerLevel";
import { sprintf } from 'sprintf-js';

export class Logger implements ILogger {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  log(level: LoggerLevel, message: any, ...args: any[]): void {
    message = message + '';

    let msg: string = sprintf(message, ...args);
    if (this._name) {
      msg = "[" + this._name + "] " + msg;
    }

    switch (level) {
      case LoggerLevel.Emergency:
      case LoggerLevel.Alert:
      case LoggerLevel.Critical:
      case LoggerLevel.Error:
        console.error(msg);
        break;
      case LoggerLevel.Warning:
        console.warn(msg);
        break;
      case LoggerLevel.Notice:
      case LoggerLevel.Info:
        console.log(msg);
        break;
      case LoggerLevel.Debug:
        console.debug(msg);
        break;
    }
  }
  
  error(message: any, ...args: any[]): void {
    this.log(LoggerLevel.Error, message, ...args);
  }
    
  warning(message: any, ...args: any[]): void {
    this.log(LoggerLevel.Warning, message, ...args);
  }

  info(message: any, ...args: any[]): void {
    this.log(LoggerLevel.Info, message, ...args);
  }

  debug(message: any, ...args: any[]): void {
    this.log(LoggerLevel.Debug, message, ...args);
  }
}