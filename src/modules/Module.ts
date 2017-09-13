import { Disposable } from "../libs/Disposable";
import { EventHandler } from "../libs/events/EventHandler";
import { ISettingsStorage } from "../settings/ISettingsStorage";
import { Storage } from "../libs/storage/Storage";
import { ModuleSettings } from "../settings/ModuleSettingsStorage";

let storage: Storage;

export function setStorage(s: Storage): void {
  storage = s;
}

export class Module extends Disposable {
  public name: string = "unknown";
  private _handler: EventHandler;
  private _settingsStorage: ISettingsStorage;

  protected disposeInternal() {
    super.disposeInternal();

    this._handler.dispose();
  }

  getHandler(): EventHandler {
    if (!this._handler) {
      this._handler = new EventHandler(this);
    }
    return this._handler;
  }

  getStorage(): ISettingsStorage {
    if (!this._settingsStorage) {
      if (!storage) throw new Error("Storage has not been initialized.");

      this._settingsStorage = new ModuleSettings(this.name, storage);
    }
    return this._settingsStorage;
  }
}

export interface ModuleConstructor {
  new (): Module
}