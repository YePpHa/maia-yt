import { ModuleApi } from "../ModuleApi";

export class Api extends ModuleApi {
  constructor() {
    super("PlayerElementsFocus");
  }

  setEnabled(enabled: boolean): void {
    this._storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this._storage.get('enabled', false);
  }

  setGlobalShortcutsEnabled(enabled: boolean): void {
    this._storage.set('globalShortcutsEnabled', enabled);
  }
  
  isGlobalShortcutsEnabled(): boolean {
    return this._storage.get('globalShortcutsEnabled', false);
  }
}