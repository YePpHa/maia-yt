import { EventTarget } from './events/EventTarget';
import { EventHandler } from './events/EventHandler';

export class Component extends EventTarget {
  private _handler: EventHandler;
  private _inDocument: boolean = false;

  protected disposeInternal() {
    super.disposeInternal();
    
    if (this._inDocument) {
      this.exitDocument();
    }

    if (this._handler) {
      this._handler.dispose();
    }
  }

  /**
   * Returns whether the component is in the document.
   */
  isInDocument(): boolean {
    return this._inDocument;
  }

  /**
   * Enter the document.
   */
  enterDocument() {
    this._inDocument = true;
  }

  /**
   * Exit the document by removing all listeners.
   */
  exitDocument() {
    if (this._handler) {
      this._handler.removeAll();
    }

    this._inDocument = false;
  }

  /**
   * Returns the event handler.
   */
  getHandler(): EventHandler {
    if (!this._handler) {
      this._handler = new EventHandler(this);
    }
    return this._handler;
  }
}
