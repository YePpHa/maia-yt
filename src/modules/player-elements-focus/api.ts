import { ISettingsStorage } from "../../settings/ISettingsStorage";

export class Api {
  constructor(private storage: ISettingsStorage) {}

  setEnabled(enabled: boolean): void {
    this.storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.storage.get('enabled', false);
  }
}