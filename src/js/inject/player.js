import Disposable from 'goog:goog.Disposable';

export class Player extends Disposable {
  /**
   * @param {?Element} element the player element.
   */
  constructor(id, element) {
    super();

    /**
     * @private {?string}
     */
    this.id_ = id;

    /**
     * @private {?Element}
     */
    this.element_ = element;
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();

    this.id_ = null;
    this.element_ = null;
  }

  /**
   * Returns the player ID.
   * @return {?string} the ID.
   */
  getId() {
    return this.id_;
  }
}
