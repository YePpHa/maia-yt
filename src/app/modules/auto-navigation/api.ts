import { AutoNavigationState } from "../../youtube/PlayerApi";
import { SettingsStorageFactory } from "../../settings-storage/SettingsStorageFactory";
import { ISettingsStorage } from "../../settings-storage/ISettingsStorage";

export class AutoNavigationApi {
  private _storage: ISettingsStorage;

  constructor(storageFactory: SettingsStorageFactory) {
    this._storage = storageFactory.createStorage("AutoNavigation");
  }

  isEnabled(): boolean {
    return this._storage.get('enabled', false);
  }
  
  setEnabled(enabled: boolean): void {
    this._storage.set('enabled', enabled);
  }

  setState(state: AutoNavigationState): void {
    this._storage.set('state', state);
  }

  getState(): AutoNavigationState {
    return this._storage.get('state', AutoNavigationState.Disabled);
  }
}