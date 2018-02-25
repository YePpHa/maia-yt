import { ElementComponent } from '../../libs/ElementComponent';
import { ServicePort } from '../../libs/messaging/ServicePort';
import { Player } from './Player';
import { v4 as uuidv4 } from 'uuid';
import { EventType } from './EventType';
import { PlayerConfig } from './PlayerConfig';

export class PlayerFactory extends ElementComponent {
  private _port: ServicePort;
  private _players: {[key: string]: Player} = {};

  constructor(port: ServicePort) {
    super();
    
    this._port = port;
  }

  /**
   * Create a new player instance by element.
   * @param element the player element.
   * @param id the id.
   * @return the player instance.
   */
  createPlayer(element: Element, playerConfig: PlayerConfig, id?: string): Player {
    if (!id) {
      id = uuidv4();
    }
    let player = new Player(id, element, playerConfig, this._port);

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

    this._port.registerService("player#api", this._handleApiCall, this);
    this._port.registerService("player#loaded", this._handlePlayerLoaded, this);
    this._port.registerService("player#events#keydown", this._handleKeyboardEvent, this)
  }

  /** @override */
  exitDocument() {
    this._port.deregisterService("player#api");
    this._port.deregisterService("player#loaded");
    this._port.deregisterService("player#events#keydown");

    super.exitDocument();
  }

  private _handleApiCall(id: string, name: string, ...args: any[]): any {
    let player = this._players[id];
    if (!player) throw new Error("Player with " + id + " couldn't be found.");
    return (player.getApi() as any)[name].apply(null, args);
  }

  private _handlePlayerLoaded(id: string, loaded: boolean): void {
    let player = this._players[id];
    if (!player) throw new Error("Player with " + id + " couldn't be found.");

    player.setLoaded(loaded);
  }

  private _handleKeyboardEvent(id: string, keyCode: number, bubbles: boolean): boolean {
    let player = this._players[id];
    if (!player) throw new Error("Player with " + id + " couldn't be found.");

    const target = player.getElement();
    let evt = document.createEvent('event') as any;
    evt.initEvent('keydown', bubbles, true);

    evt['keyCode'] = evt['charCode'] = evt['which'] = keyCode;

    target.dispatchEvent(evt);

    return (evt as Event).defaultPrevented;
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
