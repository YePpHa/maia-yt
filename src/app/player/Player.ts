import { IPlayer } from './IPlayer';
import { EventTarget } from '../libs/events/EventTarget';
import { ServicePort } from "../libs/messaging/ServicePort";
import { PlayerData, PlayerType } from '../youtube/PlayerConfig';
import { PlaybackQuality, AutoNavigationState } from '../youtube/PlayerApi';

export class Player extends EventTarget implements IPlayer {
  private _id: string;
  private _elementId: string;
  private _port: ServicePort;
  private _data: PlayerData = {};

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

  public setLoaded(loaded: boolean) {
    return this._port.callSync("player#loaded", this._id, loaded);
  }

  public triggerKeyDown(keyCode: number, bubbles: boolean): boolean {
    return this._port.callSync("player#events#keydown", this._id, keyCode, bubbles);
  }

  public setData(data: PlayerData): void {
    this._data = Object.assign(this._data, data);
  }

  public getData(): PlayerData {
    return this._data;
  }

  public isDetailPage(): boolean {
    return this._data.el === PlayerType.DetailPage || !this._data.el;
  }

  public isProfilePage(): boolean {
    return this._data.el === PlayerType.ProfilePage;
  }

  public isEmbedded(): boolean {
    return this._data.el === PlayerType.Embedded;
  }

  public setAutoNavigationState(state: AutoNavigationState): void {
    this._callApi('setAutonavState', state);
  }

  public getId(): string {
    return this._id;
  }

  public getElementId(): string {
    return this._elementId;
  }

  public getElement(): Element|null {
    return document.getElementById(this.getElementId());
  }

  public ready(): void {
    this._ready = true;
  }

  public isReady(): boolean {
    return this._ready;
  }

  public play(): void {
    this._callApi("playVideo");
  }

  public pause(): void {
    this._callApi("pauseVideo");
  }

  public stop(): void {
    this._callApi("stopVideo");
  }
  
  public cancelPlayback(): void {
    this._callApi("cancelPlayback");
  }
  
  public clearVideo(): void {
    this._callApi("clearVideo");
  }

  public seekBy(time: number): void {
    this._callApi("seekBy", time);
  }

  public seekTo(time: number): void {
    this._callApi("seekTo", time);
  }

  public loadVideoByPlayerVars(data: PlayerData): void {
    this._callApi("loadVideoByPlayerVars", data);
  }

  public cueVideoByPlayerVars(data: PlayerData): void {
    this._callApi("cueVideoByPlayerVars", data);
  }
  
  public getPlaybackQuality(): PlaybackQuality {
    return this._callApi("getPlaybackQuality");
  }
  
  public setPlaybackQuality(quality: PlaybackQuality): void {
    return this._callApi("setPlaybackQuality", quality);
  }
  
  public setPlaybackQualityRange(start: PlaybackQuality, end: PlaybackQuality): void {
    return this._callApi("setPlaybackQualityRange", start, end);
  }

  public getAvailableQualityLevels(): PlaybackQuality[] {
    return this._callApi("getAvailableQualityLevels");
  }

  public getMaxPlaybackQuality(): PlaybackQuality {
    return this._callApi("getMaxPlaybackQuality");
  }

  public handleGlobalKeyDown(keyCode: number, bubbling: boolean): void {
    return this._callApi("handleGlobalKeyDown", keyCode, bubbling);
  }

  public getVideoData(): PlayerData {
    return this._callApi("getVideoData");
  }
}