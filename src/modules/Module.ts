import { Disposable } from "../libs/Disposable";
import { EventHandler } from "../libs/events/EventHandler";

export class Module extends Disposable {
  private _handler: EventHandler;

  constructor() {
    super();
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
}

export interface ModuleConstructor {
  new (): Module
}