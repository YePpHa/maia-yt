import EventTarget from 'goog:goog.events.EventTarget';

export class Player extends EventTarget {
  /**
   * @constructor
   * @param {!App} app the app.
   * @param {!Element} el the player element.
   */
  constructor(app, el) {
    super();

    /**
     * @private {!App}
     */
    this.app_ = app;

    /**
     * @private {!Element}
     */
    this.element_ = el;
  }

  /**
   * @override
   */
  disposeInternal() {
    super.disposeInternal();

    
  }
}
