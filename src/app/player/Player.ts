import { IPlayer } from './IPlayer';
import { EventTarget } from '../../libs/events/EventTarget';
import { ServicePort } from "../../libs/messaging/ServicePort";

export class Player extends EventTarget implements IPlayer {
  private _id: string;
  private _elementId: string;
  private _port: ServicePort;

  /**
   * Whether YouTube has initialized the player yet.
   */
  private _ready: boolean = false;

  constructor(id: string, elementId: string, port: ServicePort) {
    super();

    this._id = id;
    this._elementId = elementId;
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

  getId(): string {
    return this._id;
  }

  getElementId(): string {
    return this._elementId;
  }

  getElement(): Element|null {
    return document.getElementById(this.getElementId());
  }

  ready(): void {
    this._ready = true;
  }

  isReady(): boolean {
    return this._ready;
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
  
  cancelPlayback(): void {
    this._callApi("cancelPlayback");
  }
  
  clearVideo(): void {
    this._callApi("clearVideo");
  }

  seekBy(time: number): void {
    this._callApi("seekBy", time);
  }

  seekTo(time: number): void {
    this._callApi("seekTo", time);
  }
}