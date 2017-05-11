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

    /**
     * The player API.
     * @private {?Object<string, Function>}
     */
    this.api_ = null;
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();

    this.id_ = null;
    this.element_ = null;
    this.api_ = null;
  }

  /**
   * Returns the player ID.
   * @return {?string} the ID.
   */
  getId() {
    return this.id_;
  }

  /**
   * Returns the player API.
   * @return {!Object<string, Function>} the API interface.
   */
  getApi() {
    if (!this.api_) {
      /**
       * @type {?Object}
       */
      var player = null;

      // Determine whether the API interface is on the element.
      if (typeof this.element_["getApiInterface"] === "function") {
        player = this.element_;
      } else {
        player = window['yt']['player']['getPlayerByElement'](this.element_);
      }

      /**
       * List of all the available API methods.
       * @type {!Array<string>}
       */
      var apiList = /** @type {!Array<string>} */ (player['getApiInterface']());

      this.api_ = {};

      // Populate the API object with the player API.
      goog.array.forEach(apiList, function(key) {
        this.api_[key] = player[key];
      }, this);
    }

    return this.api_;
  }
}
