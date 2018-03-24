import { PlaybackQuality } from "../../youtube/PlayerApi";
import { SettingsStorage } from "../../settings-storage/SettingsStorage";
import { SettingsStorageFactory } from "../../settings-storage/SettingsStorageFactory";
import { injectable } from "inversify";

@injectable()
export class QualityApi {
  private _storage: SettingsStorage;

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