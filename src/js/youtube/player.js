import EventTarget from 'goog:goog.events.EventTarget';
import { getRandomString } from 'goog:goog.string';
import Map from 'goog:goog.structs.Map';
import Event from 'goog:goog.events.Event';
import array from 'goog:goog.array';
import { ServicePort } from '../messaging/serviceport';

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

/**
 * @type {!Map<string, Player>}
 */
export var players = new Map();

/**
 * @param {?string} playerId the player id.
 * @param {?Object} playerConfig the player config.
 * @return {Object|undefined|null} the new player config.
 */
export function handlePlayerBeforeCreate(playerId, playerConfig) {
  // Do stuff with the player config before it's created.

  console.log("player#beforecreate", playerId, playerConfig);
}

/**
 * @param {!ServicePort} port the service port.
 * @param {!string} playerId the player id.
 */
export function handlePlayerCreate(port, playerId) {
  console.log("player#create", playerId);

  var player = new Player(port, playerId);
  players.set(playerId, player);

  player.listen(EventType.ENDED, function() {
    player.playVideo();
  });
}

/**
 * Attempts to handle the player#event.
 * @param {!string} playerId the player IDs.
 * @param {!string} eventType the event type.
 * @return {!boolean} whether preventDefault was called.
 */
export function handlePlayerEvent(playerId, eventType) {
  if (!players.containsKey(playerId)) return false;
  console.log("player#event", playerId, eventType);

  var player = players.get(playerId);
  var evt = new Event(eventType);
  player.dispatchEvent(evt);

  return evt.defaultPrevented;
}

export class Player extends EventTarget {
  /**
   * @param {!ServicePort} port the service port.
   * @param {!string} id the player element or the player ID.
   */
  constructor(port, id) {
    super();

    /**
     * @private {!ServicePort}
     */
    this.port_ = port;

    /**
     * @private {!string}
     */
    this.id_ = id;

    // Register the player for event calls.
    players.set(id, this);
  }

  /**
   * @override
   */
  disposeInternal() {
    super.disposeInternal();

    players.remove(this.id_);

    delete this.id_;
    delete this.port_;
  }

  /**
   * @param {?string} key the key of the API.
   * @param {...} var_args the arguments.
   * @return {*} the result of the API call.
   */
  callApi_(key, var_args) {
    var args = Array.prototype.slice.call(arguments, 0);
    return this.port_.call.apply(this.port_, ["player#api", this.id_].concat(args));
  }

  /**
   * Play the video.
   */
  playVideo() {
    this.callApi_("playVideo");
  }

  /**
   * Play the video.
   */
  pauseVideo() {
    this.callApi_("pauseVideo");
  }

  /**
   * Play the video.
   */
  stopVideo() {
    this.callApi_("stopVideo");
  }
}
