import { IPlayer } from './IPlayer';
import { EventTarget } from '../../libs/events/EventTarget';
import { ServicePort } from "../../libs/messaging/ServicePort";

export class Player extends EventTarget implements IPlayer {
  private _id: string;
  private _port: ServicePort;

  /**
   * Whether YouTube has initialized the player yet.
   */
  private _initialized: boolean = false;

  constructor(id: string, port: ServicePort) {
    super();

    this._id = id;
    this._port = port;
  }

  protected disposeInternal() {
    super.disposeInternal();

    delete this._id;
    delete this._port;
  }

  private _callApi(name: string, ...args: any[]): any {
    return this._port.callSync("player#api", this._id, name, ...args);
  }

  initialize(): void {
    this._initialized = true;
  }

  isInitialized(): boolean {
    return this._initialized;
  }

  play(): void {
    this._callApi("playVideo");
  }

  pause(): void {
    this._callApi("pauseVideo");
  }

  stop(): void {
    this._callApi("stopVideo");
  }

  seekBy(time: number): void {
    this._callApi("seekBy", time);
  }

  seekTo(time: number): void {
    this._callApi("seekTo", time);
  }
}