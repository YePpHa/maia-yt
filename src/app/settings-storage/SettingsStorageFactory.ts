import { SettingsStorage } from "./SettingsStorage";
import { Storage } from "../libs/storage/Storage";
import { Container, injectable } from "inversify";

export const storageCache: {[key: string]: SettingsStorage} = {};

@injectable()
export class SettingsStorageFactory {
  private _storage: Storage;
  private _container: Container;

  constructor(storage: Storage, container: Container) {
    this._storage = storage;
    this._container = container;
  }

  createStorage(namespace: string): SettingsStorage {
    if (!storageCache.hasOwnProperty(namespace)) {
      storageCache[namespace] = new SettingsStorage(namespace, this._storage);
      this._container.bind<SettingsStorage>(SettingsStorage).toConstantValue(storageCache[namespace]);
    }
    return storageCache[namespace];
  }
}