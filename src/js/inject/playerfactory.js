import { Player } from './player';
import { Component } from '../core/component';
import { ServicePort } from '../messaging/serviceport';
import Map from 'goog:goog.structs.Map';
import { getRandomString } from 'goog:goog.string';

/**
 * @param {?ServicePort} port the port to the core.
 * @param {?PlayerFactory} playerFactory the player factory for creating a new
 *    player.
 * @param {?Object} playerConfig the player configuration.
 * @param {Function=} opt_fn optional player initialization function.
 * @return {?Object} the player application.
 */
export function handlePlayerCreate(port, playerFactory, playerConfig, opt_fn) {
  var playerId = playerConfig['attrs']['id'];

  // Send a beforecreate event to the core.
  var playerConfigArgs = port.callSync("player#beforecreate", playerId,
    playerConfig['args']);
  if (playerConfigArgs) {
    playerConfig['args'] = playerConfigArgs;
  }

  var playerApp = null;
  if (opt_fn) {
    playerApp = opt_fn(playerConfig);
  }

  var playerElement = document.getElementById(playerId);
  var player = playerFactory.createPlayer(playerElement);
  player.enterDocument();

  var api = player.getApi();

  // If no initialization function.
  if (!opt_fn && playerConfigArgs) {
    api['loadVideoByPlayerVars'](playerConfigArgs);
  }

  port.call("player#create", player.getId());

  return playerApp;
}

export class PlayerFactory extends Component {
  /**
   * @param {?ServicePort} port the service port.
   */
  constructor(port) {
    super();

    /**
     * @private {?ServicePort}
     */
    this.port_ = port;

    /**
     * @private {!Map<string, Player>}
     */
    this.players_ = new Map();
  }

  /**
   * Create a new player instance by element.
   * @param {?Element} element the player element.
   * @return {!Player} the player instance.
   */
  createPlayer(element) {
    var id = getRandomString();
    var player = new Player(this.port_, id, element);

    this.players_.set(id, player);

    return player;
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();

    this.players_.forEach(function(player) {
      player.dispose();
    }, this);

    this.port_ = null;

    delete this.players_;
  }

  /** @override */
  enterDocument() {
    super.enterDocument();

    this.port_.registerService("player#api", function(id, name, var_args) {
      var player = this.players_.get(id);
      if (!player) throw new Error("Player with " + id + " couldn't be found.");

      var args = Array.prototype.slice.call(arguments, 2);

      return player.getApi()[name].apply(null, args);
    }, this);
  }

  /** @override */
  exitDocument() {
    this.port_.deregisterService("player#api");

    super.exitDocument();
  }

  /**
   * Returns an array with all the player instances.
   * @return {!Array<?Player>}
   */
  getPlayers() {
    return this.players_.getValues();
  }
}
