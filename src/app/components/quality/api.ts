import { PlaybackQuality } from "../../youtube/PlayerApi";
import { ComponentApi } from "../ComponentApi";

export class Api extends ComponentApi {
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
    return this.getStorage().get('quality', PlaybackQuality.Auto);
  }
  
  setBetterQualityPreferred(preferred: boolean): void {
    this.getStorage().set('bestQualityPreferred', preferred);
  }

  isBetterQualityPreferred(): boolean {
    return this.getStorage().get('bestQualityPreferred', true);
  }
}