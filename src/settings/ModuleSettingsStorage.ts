import { ISettingsStorage } from "./ISettingsStorage";
import { Storage } from '../libs/storage/Storage';

export class ModuleSettings implements ISettingsStorage {
  private _name: string;
  private _storage: Storage;

  constructor(name: string, storage: Storage) {
    this._name = name;
    this._storage = storage;
  }
  
  private _getSettings(): any {
    return this._storage.get("ModuleSettings_" + this._name) || {};
  }
  
  private _updateSettings(settings: any): void {
    this._storage.set("ModuleSettings_" + this._name, settings);
  }

  set(key: string, value: any): void {
    const settings = this._getSettings();
    settings[key] = value;

    this._updateSettings(settings);
  }

  get(key: string, defaultValue?: any): any {
    const settings = this._getSettings();
    if (settings.hasOwnProperty(key)) {
      return settings[key];
    }
    return defaultValue;
  }

  remove(key: string): void {
    const settings = this._getSettings();
    if (settings.hasOwnProperty(key)) {
      delete settings[key];
    }
    this._updateSettings(settings);
  }

}