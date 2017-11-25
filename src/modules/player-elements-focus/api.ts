import { ModuleApi } from "../ModuleApi";

export class Api extends ModuleApi {
  constructor() {
    super("PlayerElementsFocus");
  }

  setEnabled(enabled: boolean): void {
    this.getStorage().set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.getStorage().get('enabled', false);
  }

  setGlobalShortcutsEnabled(enabled: boolean): void {
    this.getStorage().set('globalShortcutsEnabled', enabled);
  }
  
  isGlobalShortcutsEnabled(): boolean {
    return this.getStorage().get('globalShortcutsEnabled', false);
  }
}