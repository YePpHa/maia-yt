import { PlaybackQuality } from "../../app/youtube/PlayerApi";
import { ModuleApi } from "../ModuleApi";

export class Api extends ModuleApi {
  constructor() {
    super("Quality");
  }

  setEnabled(enabled: boolean): void {
    this.getStorage().set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.getStorage().get('enabled', false);
  }

  setQuality(quality: PlaybackQuality): void {
    this.getStorage().set('quality', quality);
  }

  getQuality(): PlaybackQuality {
    return this.getStorage().get('quality', PlaybackQuality.AUTO);
  }
  
  setBetterQualityPreferred(preferred: boolean): void {
    this.getStorage().set('bestQualityPreferred', preferred);
  }

  isBetterQualityPreferred(): boolean {
    return this.getStorage().get('bestQualityPreferred', true);
  }
}