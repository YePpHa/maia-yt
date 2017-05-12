import EventTarget from 'goog:goog.events.EventTarget';
import EventHandler from 'goog:goog.events.EventHandler';

export class Component extends EventTarget {
  constructor() {
    super();

    /**
     * @private {?goog.events.EventHandler}
     */
    this.handler_ = null;

    /**
     * @private {!boolean}
     */
    this.inDocument_ = false;
  }

  /**
   * @override
   */
  disposeInternal() {
    if (this.inDocument_) {
      this.exitDocument();
    }

    if (this.handler_) {
      this.handler_.dispose();
    }

    this.handler_ = null;
  }

  /**
   * Returns whether the component is in the document.
   * @return {!boolean} whether the component is in the document.
   */
  isInDocument() {
    return this.inDocument_;
  }

  /**
   * Enter the document.
   */
  enterDocument() {
    this.inDocument_ = true;
  }

  /**
   * Exit the document by removing all listeners.
   */
  exitDocument() {
    if (this.handler_) {
      this.handler_.removeAll();
    }

    this.inDocument_ = false;
  }

  /**
   * Returns the event handler.
   * @return {?EventHandler} the event handler.
   */
  getHandler() {
    if (!this.handler_) {
      this.handler_ = new EventHandler(this);
    }
    return this.handler_;
  }
}
