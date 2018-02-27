import { AutoNavigationState } from "../../youtube/PlayerApi";
import { ComponentApi } from "../ComponentApi";

export enum AutoPlayMode {
  PAUSE = "pause",
  STOP = "stop"
}

export class Api extends ComponentApi {
  constructor() {
    super("AutoPlay");
  }

  setEnabled(enabled: boolean): void {
    this.getStorage().set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.getStorage().get('enabled', false);
  }
  
  setMode(mode: AutoPlayMode): void {
    this.getStorage().set('mode', mode);
  }

  getMode(): AutoPlayMode {
    return this.getStorage().get('mode', AutoPlayMode.PAUSE);
  }
  
  setChannelEnabled(enabled: boolean): void {
    this.getStorage().set('channelEnabled', enabled);
  }
  
  isChannelEnabled(): boolean {
    return this.getStorage().get('channelEnabled', false);
  }

  setChannelMode(mode: AutoPlayMode): void {
    this.getStorage().set('channelMode', mode);
  }

  getChannelMode(): AutoPlayMode {
    return this.getStorage().get('channelMode', AutoPlayMode.PAUSE);
  }
}