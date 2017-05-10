import EventTarget from 'goog:goog.events.EventTarget';
import { ServicePort } from '../messaging/serviceport';
import { string } from 'goog:goog.string.getRandomString';

/**
 * @enum {!string}
 */
export const EventType = {
  UNSTARTED: 'unstarted',
  ENDED: 'ended',
  PLAYING: 'playing',
  PAUSED: 'paused',
  BUFFERING: 'buffering',
  CUED: 'cued'
};

export class Player extends EventTarget {
  /**
   * @constructor
   * @param {!ServicePort} port the service port.
   * @param {!Element} el the player element.
   */
  constructor(port, el) {
    super();

    /**
     * @private {!ServicePort}
     */
    this.port_ = port;

    /**
     * @private {!string}
     */
    this.id_ = string.getRandomString();

    el.setAttribute("maia:id", this.id_);

    try {
      // This will throw an error if it fails.
      this.port_.callSync("player#constructor", this.id_);
      el.removeAttribute("maia:id");
    } catch (e) {
      el.removeAttribute("maia:id");
      throw e;
    }
  }

  /**
   * @override
   */
  disposeInternal() {
    super.disposeInternal();

    this.port_.call("player#dispose", this.id_);

    delete this.port_;
    delete this.element_;
  }
}
