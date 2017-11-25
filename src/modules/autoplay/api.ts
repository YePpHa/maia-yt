import { AutoPlayMode } from "./index";
import { AutoNavigationState } from "../../app/youtube/PlayerApi";
import { ModuleApi } from "../ModuleApi";

export class Api extends ModuleApi {
  constructor() {
    super("AutoPlay");
  }

  setEnabled(enabled: boolean): void {
    this._storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this._storage.get('enabled', false);
  }
  
  setMode(mode: AutoPlayMode): void {
    this._storage.set('mode', mode);
  }

  getMode(): AutoPlayMode {
    return this._storage.get('mode', AutoPlayMode.PAUSE);
  }
  
  setChannelEnabled(enabled: boolean): void {
    this._storage.set('channelEnabled', enabled);
  }
  
  isChannelEnabled(): boolean {
    return this._storage.get('channelEnabled', false);
  }

  setChannelMode(mode: AutoPlayMode): void {
    this._storage.set('channelMode', mode);
  }

  getChannelMode(): AutoPlayMode {
    return this._storage.get('channelMode', AutoPlayMode.PAUSE);
  }
  
  isAutoNavigationEnabled(): boolean {
    return this._storage.get('autoNavigationEnabled', false);
  }
  
  setAutoNavigationEnabled(enabled: boolean): void {
    this._storage.set('autoNavigationEnabled', enabled);
  }

  setAutoNavigationState(state: AutoNavigationState): void {
    this._storage.set('autonavState', state);
  }

  getAutoNavigationState(): AutoNavigationState {
    return this._storage.get('autonavState', AutoNavigationState.DISABLED);
  }
}