import { SettingsStorageFactory } from "../../settings-storage/SettingsStorageFactory";
import { ISettingsStorage } from "../../settings-storage/ISettingsStorage";

export enum AutoPlayMode {
  Pause = "pause",
  Stop = "stop"
}

export class AutoPlayApi {
  private _storage: ISettingsStorage;

  constructor(storageFactory: SettingsStorageFactory) {
    this._storage = storageFactory.createStorage("AutoPlay");
  }

  setEnabled(enabled: boolean): void {
    this._storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this._storage.get('enabled', false);
  }
  
  setMode(mode: AutoPlayMode): void {
    this._storage.set('mode', mode);
  }

  getMode(): AutoPlayMode {
    return this._storage.get('mode', AutoPlayMode.Pause);
  }
  
  setChannelEnabled(enabled: boolean): void {
    this._storage.set('channelEnabled', enabled);
  }
  
  isChannelEnabled(): boolean {
    return this._storage.get('channelEnabled', false);
  }

  setChannelMode(mode: AutoPlayMode): void {
    this._storage.set('channelMode', mode);
  }

  getChannelMode(): AutoPlayMode {
    return this._storage.get('channelMode', AutoPlayMode.Pause);
  }
}