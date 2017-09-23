import { ISettingsStorage } from "../../settings/ISettingsStorage";
import { PlaybackQuality } from "../../app/youtube/PlayerApi";
import { getSettingsStorage } from '../Module';

export class Api {
  private storage: ISettingsStorage;
  
  constructor() {
    this.storage = getSettingsStorage("Quality");
  }

  setEnabled(enabled: boolean): void {
    this.storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.storage.get('enabled', false);
  }

  setQuality(quality: PlaybackQuality): void {
    this.storage.set('quality', quality);
  }

  getQuality(): PlaybackQuality {
    return this.storage.get('quality', PlaybackQuality.AUTO);
  }
  
  setBetterQualityPreferred(preferred: boolean): void {
    this.storage.set('bestQualityPreferred', preferred);
  }

  isBetterQualityPreferred(): boolean {
    return this.storage.get('bestQualityPreferred', true);
  }
}