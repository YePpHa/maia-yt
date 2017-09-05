import { Disposable } from "../libs/Disposable";
import { EventHandler } from "../libs/events/EventHandler";
import { ISettingsStorage } from "../settings/ISettingsStorage";
import { Storage } from "../libs/storage/Storage";
import { ModuleSettings } from "../settings/ModuleSettingsStorage";

export class Module extends Disposable {
  public name: string = "unknown";
  private _handler: EventHandler;
  private _settingsStorage: ISettingsStorage;

  constructor(storage: Storage) {
    super();

    this._settingsStorage = new ModuleSettings(this.name, storage);
  }

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
    return this._settingsStorage;
  }
}

export interface ModuleConstructor {
  new (storage: Storage): Module
}