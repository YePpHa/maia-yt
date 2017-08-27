import { Component } from '../../libs/Component';
import { ServicePort } from '../../libs/messaging/ServicePort';
import { Player } from './Player';
import { v4 as uuidv4 } from 'uuid';

export class PlayerFactory extends Component {
  private _port: ServicePort;
  private _players: {[key: string]: Player} = {};

  constructor(port: ServicePort) {
    super();
    
    this._port = port;
  }

  /**
   * Create a new player instance by element.
   * @param element the player element.
   * @return the player instance.
   */
  createPlayer(element: Element): Player {
    var id = uuidv4();
    var player = new Player(id, element, this._port);

    this._players[id] = player;

    return player;
  }

  protected disposeInternal() {
    super.disposeInternal();

    for (let key in this._players) {
      if (this._players.hasOwnProperty(key)) {
        this._players[key].dispose();
      }
    }
    delete this._players;
    delete this._port;
  }

  /** @override */
  enterDocument() {
    super.enterDocument();

    this._port.registerService("player#api", (id: string, name: string, ...args: any[]) => {
      var player = this._players[id];
      if (!player) throw new Error("Player with " + id + " couldn't be found.");

      return (player.getApi() as any)[name].apply(null, args);
    }, this);
  }

  /** @override */
  exitDocument() {
    this._port.deregisterService("player#api");

    super.exitDocument();
  }

  /**
   * Returns an array with all the player instances.
   */
  getPlayers(): Player[] {
    let players: Player[] = [];
    for (let key in this._players) {
      if (this._players.hasOwnProperty(key)) {
        players.push(this._players[key]);
      }
    }
    return players;
  }
}
