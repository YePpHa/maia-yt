import { Mechanism } from './mechanism/Mechanism';
import { ErrorCode } from './ErrorCode';

export class Storage {
  constructor(
    protected mechanism: Mechanism
  ) {}

  async set(key: string, value: any): Promise<void> {
    if (value === void 0) {
      await this.mechanism.remove(key);
      return;
    }
    await this.mechanism.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<any> {
    let json;
    try {
      json = await this.mechanism.get(key);
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

  async remove(key: string): Promise<void> {
    await this.mechanism.remove(key);
  }
}