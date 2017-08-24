import { Mechanism } from './mechanism/Mechanism';
import * as ErrorCode from './ErrorCode';

export class Storage {
  constructor(
    protected mechanism: Mechanism
  ) {}

  set(key: string, value: any): void {
    if (value === void 0) {
      this.mechanism.remove(key);
      return;
    }
    this.mechanism.set(key, JSON.stringify(value));
  }

  get(key: string): any {
    let json;
    try {
      json = this.mechanism.get(key);
    } catch (e) {
      return undefined;
    }
    if (json === null) {
      return undefined;
    }

    try {
      return JSON.parse(json);
    } catch (e) {
      throw ErrorCode.INVALID_VALUE;
    }
  }

  remove(key: string): void {
    this.mechanism.remove(key);
  }
}