import { Mechanism } from './Mechanism';
import { ErrorCode } from '../ErrorCode';
import * as browser from 'webextension-polyfill';

export class WebExtensionMechanism implements Mechanism {
  /**
   * Determines whether or not the mechanism is available.
   */
  async isAvailable(): Promise<boolean> {
    try {
      await browser.storage.local.set({ '__sak': '1' });
      await browser.storage.local.remove('__sak');
      return true;
    } catch (e) {
      return false;
    }
  }

  /** @override */
  async set(key: string, value: string): Promise<void> {
    const obj = {} as any;
    obj[key] = value;
    await browser.storage.local.set(obj);
  }

  /** @override */
  async get(key: string): Promise<string> {
    const values = await browser.storage.local.get(key);
    const value = values[key];
    if (typeof value !== "string" && value !== null) {
      throw ErrorCode.InvalidValue;
    }
    return value;
  }

  /** @override */
  async remove(key: string): Promise<void> {
    await browser.storage.local.remove(key);
  }
}