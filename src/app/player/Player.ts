import { IPlayer } from './IPlayer';
import { EventTarget } from '../../libs/events/EventTarget';
import { ServicePort } from "../../libs/messaging/ServicePort";
import { PlayerData, PlayerType } from '../youtube/PlayerConfig';
import { PlaybackQuality, AutoNavigationState } from '../youtube/PlayerApi';
import * as _ from 'lodash';

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

  setLoaded(loaded: boolean) {
    return this._port.callSync("player#loaded", this._id, loaded);
  }

  triggerKeyDown(keyCode: number, bubbles: boolean): void {
    return this._port.callSync("player#events#keydown", this._id, keyCode, bubbles);
  }

  setData(data: PlayerData): void {
    _.merge(this._data, data);
  }

  getData(): PlayerData {
    return this._data;
  }

  isDetailPage(): boolean {
    return this._data.el === PlayerType.DETAIL_PAGE || !this._data.el;
  }

  isProfilePage(): boolean {
    return this._data.el === PlayerType.PROFILE_PAGE;
  }

  isEmbedded(): boolean {
    return this._data.el === PlayerType.EMBEDDED;
  }

  setAutoNavigationState(state: AutoNavigationState): void {
    this._callApi('setAutonavState', state);
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

  loadVideoByPlayerVars(data: PlayerData): void {
    this._callApi("loadVideoByPlayerVars", data);
  }

  cueVideoByPlayerVars(data: PlayerData): void {
    this._callApi("cueVideoByPlayerVars", data);
  }
  
  getPlaybackQuality(): PlaybackQuality {
    return this._callApi("getPlaybackQuality");
  }
  
  setPlaybackQuality(quality: PlaybackQuality): void {
    return this._callApi("setPlaybackQuality", quality);
  }
  
  setPlaybackQualityRange(start: PlaybackQuality, end: PlaybackQuality): void {
    return this._callApi("setPlaybackQualityRange", start, end);
  }

  getAvailableQualityLevels(): PlaybackQuality[] {
    return this._callApi("getAvailableQualityLevels");
  }

  getMaxPlaybackQuality(): PlaybackQuality {
    return this._callApi("getMaxPlaybackQuality");
  }

  handleGlobalKeyDown(keyCode: number, bubbling: boolean): void {
    return this._callApi("handleGlobalKeyDown", keyCode, bubbling);
  }

  getVideoData(): PlayerData {
    return this._callApi("getVideoData");
  }

  setVolume(volume: number): void {
    this._callApi("setVolume", volume);
  }

  getVolume(): number {
    return this._callApi("getVolume");
  }

  isMuted(): boolean {
    return this._callApi("isMuted");
  }

  mute(): void {
    this._callApi("mute");
  }

  unmute(): void {
    this._callApi("unmute");
  }
}