import { SettingsStorage } from "./SettingsStorage";
import { IStorage } from "../libs/storage/models/IStorage";
import { Container, InterfaceSymbol } from "ts-di-transformer/api";
import { ISettingsStorage } from "./ISettingsStorage";

export const storageCache: {[key: string]: ISettingsStorage} = {};

export class SettingsStorageFactory {
  private _storage: IStorage;
  private _container: Container;

  constructor(storage: IStorage, container: Container) {
    this._storage = storage;
    this._container = container;
  }

  createStorage(namespace: string): ISettingsStorage {
    if (!storageCache.hasOwnProperty(namespace)) {
      storageCache[namespace] = new SettingsStorage(namespace, this._storage);
      this._container.bindToConstant(InterfaceSymbol<ISettingsStorage>(), storageCache[namespace]);
    }
    return storageCache[namespace];
  }
}