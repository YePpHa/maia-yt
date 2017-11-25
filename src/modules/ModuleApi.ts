import { ISettingsStorage } from "../settings/ISettingsStorage";
import { getSettingsStorage } from "./Module";

export class ModuleApi {
  protected _storage: ISettingsStorage;
  
  constructor(namespace: string) {
    this._storage = getSettingsStorage(namespace);
  }

  async updateCache(): Promise<void> {
    await this._storage.updateCache();
  }
}