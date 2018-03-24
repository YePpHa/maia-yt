import { Mechanism } from './Mechanism';
import { ErrorCode } from '../ErrorCode';

const STORAGE_AVAILABLE_KEY_ = '__sak';

export class LocalStorageMechanism implements Mechanism {
  private _storage?: Storage;

  constructor() {
    try {
      this._storage = window.localStorage;
    } catch (e) {}
  }

  /**
   * Determines whether or not the mechanism is available.
   */
  isAvailable(): boolean {
    if (!this._storage) {
      return false;
    }

    try {
      this._storage.setItem(STORAGE_AVAILABLE_KEY_, '1');
      this._storage.removeItem(STORAGE_AVAILABLE_KEY_);

      return true;
    } catch (e) {
      return false;
    }
  }

  /** @override */
  set(key: string, value: string) {
    if (!this._storage) throw new Error("localStorage is not available");
    try {
      this._storage.setItem(key, value);
    } catch (e) {
      if (this._storage.length === 0) {
        throw ErrorCode.StorageDisabled;
      } else {
        throw ErrorCode.QuotaExceeded;
      }
    }
  }

  /** @override */
  get(key: string): string {
    if (!this._storage) throw new Error("localStorage is not available");

    let value: string|null = this._storage.getItem(key);
    if (typeof value !== "string" && value !== null) {
      throw ErrorCode.InvalidValue;
    }
    return value as string;
  }

  /** @override */
  remove(key: string): void {
    if (!this._storage) throw new Error("localStorage is not available");
    
    this._storage.removeItem(key);
  }
}