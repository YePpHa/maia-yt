import { ISettingsStorage } from "./ISettingsStorage";
import { Storage } from '../libs/storage/Storage';

export class SettingsStorage implements ISettingsStorage {
  private _name: string;
  private _cache: any;
  private _storage: Storage;

  constructor(name: string, storage: Storage) {
    this._name = name;
    this._storage = storage;
  }

  getName(): string {
    return this._name;
  }

  async updateCache(): Promise<void> {
    this._cache = await this._getSettings();
  }
  
  private async _getSettings(): Promise<any> {
    return await this._storage.get("ComponentSettings_" + this._name) || {};
  }
  
  private async _updateSettings(): Promise<void> {
    await this._storage.set("ComponentSettings_" + this._name, this._cache);
  }

  set(key: string, value: any): void {
    if (!this._cache) throw new Error("Cache hasn't been created yet.");
    this._cache[key] = value;

    this._updateSettings();
  }

  get(key: string, defaultValue?: any): any {
    if (!this._cache) throw new Error("Cache hasn't been created yet.");
    if (this._cache.hasOwnProperty(key)) {
      return this._cache[key];
    }
    return defaultValue;
  }

  remove(key: string): void {
    if (!this._cache) throw new Error("Cache hasn't been created yet.");
    if (this._cache.hasOwnProperty(key)) {
      delete this._cache[key];
    }
    this._updateSettings();
  }
}