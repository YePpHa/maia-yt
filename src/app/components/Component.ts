import { Disposable } from "../libs/Disposable";
import { EventHandler } from "../libs/events/EventHandler";
import { ISettingsStorage } from "../settings/ISettingsStorage";
import { Storage } from "../libs/storage/Storage";
import { ComponentSettings } from "../settings/ComponentSettingsStorage";
import { ComponentApi } from "./ComponentApi";
import container from "../inversify.config";

export abstract class Component extends Disposable {
  private _handler?: EventHandler;

  protected disposeInternal() {
    super.disposeInternal();

    if (this._handler) {
      this._handler.dispose();
      this._handler = undefined;
    }
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