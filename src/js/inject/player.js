import { Component } from '../core/component';
import { ServicePort } from '../messaging/serviceport';
import { EventType } from '../youtube/player';
import { PlayerListenable, PlayerEvent } from './playerlistenable';
import Listenable from 'goog:goog.events.Listenable';

export class Player extends Component {
  /**
   * @param {?Element} element the player element.
   */
  constructor(port, id, element) {
    super();

    /**
     * @private {?ServicePort}
     */
    this.port_ = port;

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
  enterDocument() {
    super.enterDocument();
    this.getHandler()
      .listen(new PlayerListenable(this.getApi()), "onStateChange", this.handleOnStateChange_, false);
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
      var player = this.element_;

      // Determine whether the API interface is on the element.
      if (typeof this.element_["getApiInterface"] === "function") {
        player = this.element_;
      } else {
        throw new Error("No API interface on player element.");
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

  /**
   * Attempts to handle the on state change.
   * @param {?PlayerEvent} e the browser event.
   * @private
   */
  handleOnStateChange_(e) {
    var state = /** @type {!number} */ (e.detail);

    /**
     * @type {?EventType}
     */
    var type = null;
    
    switch (state) {
      case -1:
        type = EventType.UNSTARTED;
        break;
      case 0:
        type = EventType.ENDED;
        break;
      case 1:
        type = EventType.PLAYING;
        break;
      case 2:
        type = EventType.PAUSED;
        break;
      case 3:
        type = EventType.BUFFERING;
        break;
      case 5:
        type = EventType.CUED;
        break;
    }

    if (!type) return;
    var preventDefault = this.port_.call("player#event", this.getId(), type);
    if (preventDefault) {
      console.warn("player#event -> preventDefault hasn't been implemented yet.");
    }
  }
}
