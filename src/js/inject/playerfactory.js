import { Player } from './player';
import { Component } from '../core/component';
import { ServicePort } from '../messaging/serviceport';
import Map from 'goog:goog.structs.Map';

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

    this.port_.registerService("player#constructor", function(id) {
      var element = document.querySelector("[maia:id=" + id + "]");
      if (!element) throw new Error("Player element with " + id + " couldn't be found.");

      this.players_.set(id, new Player(id, element));
    }, this);
    this.port_.registerService("player#dispose", function(id) {
      var player = this.players_.get(id);
      if (!player) throw new Error("Player with " + id + " couldn't be found.");
      player.remove(id);

      // Dispose the player.
      player.dispose();
    }, this);
    this.port_.registerService("player#api", function(id, name, var_args) {
      var player = this.players_.get(id);
      if (!player) throw new Error("Player with " + id + " couldn't be found.");

      var args = Array.prototype.slice.call(arguments, 2);

      return player.getApi()[name].apply(null, args);
    }, this);
  }

  /** @override */
  exitDocument() {
    this.port_.deregisterService("player#constructor");
    this.port_.deregisterService("player#dispose");
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
