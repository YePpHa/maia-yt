import { ISettingsStorage } from "../../settings/ISettingsStorage";
import { AutoPlayMode } from "./index";

export class Api {
  constructor(private storage: ISettingsStorage) {}

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
}