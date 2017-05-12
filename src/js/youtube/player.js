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
  READY: 'ready',
  UNSTARTED: 'unstarted',
  ENDED: 'ended',
  PLAYING: 'playing',
  PAUSED: 'paused',
  BUFFERING: 'buffering',
  CUED: 'cued',
  PLAYBACK_QUALITY_CHANGE: 'playback-quality-change',
  PLAYBACK_RATE_CHANGE: 'playback-rate-change',
  API_CHANGE: 'api-change',
  ERROR: 'error'
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
 * @param {*} detail the detail.
 * @return {!boolean} whether preventDefault was called.
 */
export function handlePlayerEvent(playerId, eventType, detail) {
  if (!players.containsKey(playerId)) return false;
  console.log("player#event", playerId, eventType, detail);

  var evt;

  var player = players.get(playerId);

  if (eventType === EventType.PLAYBACK_QUALITY_CHANGE) {
    evt = new PlaybackQualityEvent(/** @type {!string} */ (detail));
  } else if (eventType === EventType.PLAYBACK_RATE_CHANGE) {
    evt = new PlaybackRateEvent(/** @type {!number} */ (detail));
  } else if (eventType === EventType.ERROR) {
    evt = new ErrorEvent(/** @type {!number} */ (detail));
  } else {
    evt = new Event(eventType);
  }

  player.dispatchEvent(evt);

  return evt.defaultPrevented;
}

export class PlaybackQualityEvent extends Event {
  /**
   * @param {!string} quality the quality.
   * @param {Object=} opt_target optional target.
   */
  constructor(quality, opt_target) {
    super(EventType.PLAYBACK_QUALITY_CHANGE, opt_target);

    /**
     * The quality.
     * @public {!string}
     */
    this.quality = quality;
  }
}

export class PlaybackRateEvent extends Event {
  /**
   * @param {!number} rate the rate.
   * @param {Object=} opt_target optional target.
   */
  constructor(rate, opt_target) {
    super(EventType.PLAYBACK_RATE_CHANGE, opt_target);

    /**
     * The rate.
     * @public {!number}
     */
    this.rate = rate;
  }
}

export class ErrorEvent extends Event {
  /**
   * @param {!number} errorCode the error code.
   * @param {Object=} opt_target optional target.
   */
  constructor(errorCode, opt_target) {
    super(EventType.ERROR, opt_target);

    /**
     * The error code.
     * @public {!number}
     */
    this.errorCode = errorCode;
  }
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
