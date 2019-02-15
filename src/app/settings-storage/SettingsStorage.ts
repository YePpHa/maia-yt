import { ISettingsStorage } from "./ISettingsStorage";
import { IStorage } from "../libs/storage/models/IStorage";

export class SettingsStorage implements ISettingsStorage {
  private _name: string;
  private _cache: any;
  private _storage: IStorage;

  constructor(name: string, storage: IStorage) {
    this._name = name;
    this._storage = storage;
  }

  public getName(): string {
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

  public set(key: string, value: any): void {
    if (!this._cache) throw new Error("Cache hasn't been created yet.");
    this._cache[key] = value;

    this._updateSettings();
  }

  public get(key: string, defaultValue?: any): any {
    if (!this._cache) throw new Error("Cache hasn't been created yet.");
    if (this._cache.hasOwnProperty(key)) {
      return this._cache[key];
    }
    return defaultValue;
  }

  public remove(key: string): void {
    if (!this._cache) throw new Error("Cache hasn't been created yet.");
    if (this._cache.hasOwnProperty(key)) {
      delete this._cache[key];
    }
    this._updateSettings();
  }
}