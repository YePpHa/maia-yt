import { PlaybackQuality } from "../../youtube/PlayerApi";
import { ISettingsStorage } from "../../settings-storage/ISettingsStorage";
import { SettingsStorageFactory } from "../../settings-storage/SettingsStorageFactory";

export class QualityApi {
  private _storage: ISettingsStorage;

  constructor(storageFactory: SettingsStorageFactory) {
    this._storage = storageFactory.createStorage("Quality");
  }

  setEnabled(enabled: boolean): void {
    this._storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this._storage.get('enabled', false);
  }

  setQuality(quality: PlaybackQuality): void {
    this._storage.set('quality', quality);
  }

  getQuality(): PlaybackQuality {
    return this._storage.get('quality', PlaybackQuality.Auto);
  }
  
  setBetterQualityPreferred(preferred: boolean): void {
    this._storage.set('bestQualityPreferred', preferred);
  }

  isBetterQualityPreferred(): boolean {
    return this._storage.get('bestQualityPreferred', true);
  }
}