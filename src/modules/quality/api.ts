import { PlaybackQuality } from "../../app/youtube/PlayerApi";
import { ModuleApi } from "../ModuleApi";

export class Api extends ModuleApi {
  constructor() {
    super("Quality");
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
    return this._storage.get('quality', PlaybackQuality.AUTO);
  }
  
  setBetterQualityPreferred(preferred: boolean): void {
    this._storage.set('bestQualityPreferred', preferred);
  }

  isBetterQualityPreferred(): boolean {
    return this._storage.get('bestQualityPreferred', true);
  }
}