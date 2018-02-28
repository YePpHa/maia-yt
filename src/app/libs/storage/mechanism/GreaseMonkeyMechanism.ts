import { Mechanism } from './Mechanism';
import { ErrorCode } from '../ErrorCode';

const STORAGE_AVAILABLE_KEY_ = '__sak';

export class GreaseMonkeyMechanism implements Mechanism {
  /**
   * Determines whether or not the mechanism is available.
   */
  isAvailable(): boolean {
    try {
      GM_setValue(STORAGE_AVAILABLE_KEY_, '1');
      GM_deleteValue(STORAGE_AVAILABLE_KEY_);
      return true;
    } catch (e) {
      return false;
    }
  }

  /** @override */
  set(key: string, value: string) {
    GM_setValue(key, value);
  }

  /** @override */
  get(key: string): string {
    let value: string = GM_getValue(key);
    if (typeof value !== "string" && value !== null) {
      throw ErrorCode.InvalidValue;
    }
    return value;
  }

  /** @override */
  remove(key: string): void {
    GM_deleteValue(key);
  }
}