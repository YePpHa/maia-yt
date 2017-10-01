import { ISettingsStorage } from "../../settings/ISettingsStorage";
import { AutoPlayMode } from "./index";
import { getSettingsStorage } from "../Module";
import { AutoNavigationState } from "../../app/youtube/PlayerApi";

export class Api {
  private storage: ISettingsStorage;
  
  constructor() {
    this.storage = getSettingsStorage("AutoPlay");
  }

  setEnabled(enabled: boolean): void {
    this.storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.storage.get('enabled', false);
  }
  
  setMode(mode: AutoPlayMode): void {
    this.storage.set('mode', mode);
  }

  getMode(): AutoPlayMode {
    return this.storage.get('mode', AutoPlayMode.PAUSE);
  }
  
  setChannelEnabled(enabled: boolean): void {
    this.storage.set('channelEnabled', enabled);
  }
  
  isChannelEnabled(): boolean {
    return this.storage.get('channelEnabled', false);
  }

  setChannelMode(mode: AutoPlayMode): void {
    this.storage.set('channelMode', mode);
  }

  getChannelMode(): AutoPlayMode {
    return this.storage.get('channelMode', AutoPlayMode.PAUSE);
  }
  
  isAutoNavigationEnabled(): boolean {
    return this.storage.get('autoNavigationEnabled', false);
  }
  
  setAutoNavigationEnabled(enabled: boolean): void {
    this.storage.set('autoNavigationEnabled', enabled);
  }

  setAutoNavigationState(state: AutoNavigationState): void {
    this.storage.set('autonavState', state);
  }

  getAutoNavigationState(): AutoNavigationState {
    return this.storage.get('autonavState', AutoNavigationState.DISABLED);
  }
}