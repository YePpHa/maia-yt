import { Disposable } from "../libs/Disposable";
import { EventHandler } from "../libs/events/EventHandler";
import { ISettingsStorage } from "../settings/ISettingsStorage";
import { Storage } from "../libs/storage/Storage";
import { ComponentSettings } from "../settings/ComponentSettingsStorage";
import { ComponentApi } from "./ComponentApi";

let storage: Storage|undefined = undefined;

export function setStorage(s: Storage): void {
  storage = s;
}

export function getSettingsStorage(name: string): ISettingsStorage {
  if (!storage) throw new Error("Storage has not been initialized.");

  return new ComponentSettings(name, storage);
}

export abstract class Component extends Disposable {
  private _handler: EventHandler;

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

  abstract getApi(): ComponentApi;
}

export interface ComponentConstructor {
  new (): Component
}