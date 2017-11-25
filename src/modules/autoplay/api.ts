import { AutoPlayMode } from "./index";
import { AutoNavigationState } from "../../app/youtube/PlayerApi";
import { ModuleApi } from "../ModuleApi";

export class Api extends ModuleApi {
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
  
  isAutoNavigationEnabled(): boolean {
    return this.getStorage().get('autoNavigationEnabled', false);
  }
  
  setAutoNavigationEnabled(enabled: boolean): void {
    this.getStorage().set('autoNavigationEnabled', enabled);
  }

  setAutoNavigationState(state: AutoNavigationState): void {
    this.getStorage().set('autonavState', state);
  }

  getAutoNavigationState(): AutoNavigationState {
    return this.getStorage().get('autonavState', AutoNavigationState.DISABLED);
  }
}