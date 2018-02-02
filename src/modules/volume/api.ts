import { PlaybackQuality } from "../../app/youtube/PlayerApi";
import { ModuleApi } from "../ModuleApi";

export class Api extends ModuleApi {
  constructor() {
    super("Volume");
  }

  setEnabled(enabled: boolean): void {
    this.getStorage().set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.getStorage().get('enabled', false);
  }

  setVolume(volume: number): void {
    this.getStorage().set('volume', volume);
  }

  getVolume(): number {
    return this.getStorage().get('volume', 1);
  }

  setMuted(muted: boolean): void {
    this.getStorage().set('muted', muted);
  }

  isMuted(): boolean {
    return this.getStorage().get('muted');
  }
}