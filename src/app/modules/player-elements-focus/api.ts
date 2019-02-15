import { SettingsStorageFactory } from "../../settings-storage/SettingsStorageFactory";
import { ISettingsStorage } from "../../settings-storage/ISettingsStorage";

export class PlayerElementsFocusApi {
  private _storage: ISettingsStorage;

  constructor(storageFactory: SettingsStorageFactory) {
    this._storage = storageFactory.createStorage("PlayerElementsFocus");
  }

  setEnabled(enabled: boolean): void {
    this._storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this._storage.get('enabled', false);
  }

  setGlobalShortcutsEnabled(enabled: boolean): void {
    this._storage.set('globalShortcutsEnabled', enabled);
  }
  
  isGlobalShortcutsEnabled(): boolean {
    return this._storage.get('globalShortcutsEnabled', false);
  }
}