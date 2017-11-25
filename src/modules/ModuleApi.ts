import { ISettingsStorage } from "../settings/ISettingsStorage";
import { getSettingsStorage } from "./Module";

export class ModuleApi {
  private _namespace: string;
  private _storage: ISettingsStorage;
  
  constructor(namespace: string) {
    this._namespace = namespace;
    this._storage = getSettingsStorage(namespace);
  }

  getStorage(): ISettingsStorage {
    return this._storage;
  }

  getNamespace(): string {
    return this._namespace;
  }

  async updateCache(): Promise<void> {
    await this._storage.updateCache();
  }
}