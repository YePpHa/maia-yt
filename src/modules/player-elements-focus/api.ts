import { ISettingsStorage } from "../../settings/ISettingsStorage";
import { getSettingsStorage } from "../Module";

export class Api {
  private storage: ISettingsStorage;
  
  constructor() {
    this.storage = getSettingsStorage("PlayerElementsFocus");
  }

  setEnabled(enabled: boolean): void {
    this.storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.storage.get('enabled', false);
  }

  setGlobalShortcutsEnabled(enabled: boolean): void {
    this.storage.set('globalShortcutsEnabled', enabled);
  }
  
  isGlobalShortcutsEnabled(): boolean {
    return this.storage.get('globalShortcutsEnabled', false);
  }
}