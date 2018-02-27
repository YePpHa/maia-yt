import { ISettingsStorage } from "../settings/ISettingsStorage";
import { ComponentSettings } from "../settings/ComponentSettingsStorage";
import { Storage } from "../libs/storage/Storage";
import container from "../inversify.config";
import { ApiStorageToken } from "./ApiStorage";

export class ComponentApi {
  private _namespace: string;
  private _storage: ISettingsStorage;
  
  constructor(namespace: string) {
    this._namespace = namespace;
    this._storage = new ComponentSettings(namespace, container.get<Storage>(ApiStorageToken));
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