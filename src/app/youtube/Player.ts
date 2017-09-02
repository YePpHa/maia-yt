import { ServicePort } from '../../libs/messaging/ServicePort';
import { Component } from '../../libs/Component';
import { PlayerApi, PlayerState, PlaybackQuality } from './PlayerApi';
import { PlayerListenable, PlayerEvent } from './PlayerListenable';
import { EventType } from './EventType';

declare interface PlayerApiElement extends Element {
  getApiInterface: () => string[];
}

declare interface VolumeChangeDetail {
  muted: boolean;
  volume: number;
}

declare interface FullscreenChangeDetail {
  fullscreen: number;
  time: number;
  videoId: string;
}

export class Player extends Component {
  private _id: string;
  private _element: Element;
  private _port: ServicePort;

  private _api: PlayerApi;

  constructor(id: string, element: Element, port: ServicePort) {
    super();
    this._id = id;
    this._element = element;
    this._port = port;
  }
  
  protected disposeInternal() {
    super.disposeInternal();

    delete this._element;
    delete this._api;
    delete this._port;
  }

  enterDocument() {
    super.enterDocument();

    let player = new PlayerListenable(this.getApi());

    this.getHandler()
      .listen(player, "onReady", this._handleOnReady, false)
      .listen(player, "onStateChange", this._handleOnStateChange, false)
      .listen(player, "onVolumeChange", this._handleOnVolumeChange, false)
      .listen(player, "onFullscreenChange", this._handleOnFullscreenChange, false)
      .listen(player, "onPlaybackQualityChange", this._handleOnPlaybackQualityChange, false)
      .listen(player, "onPlaybackRateChange", this._handleOnPlaybackRateChange, false)
      .listen(player, "onApiChange", this._handleOnApiChange, false)
      .listen(player, "onError", this._handleOnError, false)
      .listen(player, "SIZE_CLICKED", this._handleSizeClicked, false);
  }

  exitDocument() {
    super.exitDocument();
  }

  getId(): string {
    return this._id;
  }

  getApi(): PlayerApi {
    if (!this._api) {
      let player = this._element as PlayerApiElement;

      // Determine whether the API interface is on the element.
      if (typeof player.getApiInterface !== "function") {
        throw new Error("No API interface on player element.");
      }

      // List of all the available API methods.
      let apiList = player.getApiInterface();

      let api = {} as PlayerApi;

      // Populate the API object with the player API.
      for (let i = 0; i < apiList.length; i++) {
        let key = apiList[i];
        (api as any)[key] = (player as any)[key];
      }

      this._api = api;
    }

    return this._api;
  }
  
  private _handleOnReady() {
    this._port.callSync("player#event", this.getId(), EventType.READY);
  }

  private _handleOnStateChange(e: PlayerEvent) {
    let state = e.detail as PlayerState;

    let type: EventType;
    switch (state) {
      case -1:
        type = EventType.UNSTARTED;
        break;
      case 0:
        type = EventType.ENDED;
        break;
      case 1:
        type = EventType.PLAYED;
        break;
      case 2:
        type = EventType.PAUSED;
        break;
      case 3:
        type = EventType.BUFFERING;
        break;
      case 5:
        type = EventType.CUED;
        break;
      default:
        return;
    }
  
    this._port.callSync("player#event", this.getId(), type);
  }
  
  private _handleOnVolumeChange(e: PlayerEvent) {
    let detail = e.detail as VolumeChangeDetail;
    this._port.callSync("player#event", this.getId(), EventType.VOLUME_CHANGE, detail.volume, detail.muted);
  }
    
  private _handleOnFullscreenChange(e: PlayerEvent) {
    let detail = e.detail as FullscreenChangeDetail;
    this._port.callSync("player#event", this.getId(), EventType.VOLUME_CHANGE, detail.fullscreen);
  }

  private _handleOnPlaybackQualityChange(e: PlayerEvent) {
    let quality = e.detail as PlaybackQuality;
    this._port.callSync("player#event", this.getId(), EventType.QUALITY_CHANGE, quality);
  }

  private _handleOnPlaybackRateChange(e: PlayerEvent) {
    let rate = e.detail as number;
    this._port.callSync("player#event", this.getId(), EventType.RATE_CHANGE, rate);
  }

  private _handleOnApiChange() {
    this._port.callSync("player#event", this.getId(), EventType.API_CHANGE);
  }

  private _handleOnError(e: PlayerEvent) {
    let errorCode = e.detail as number;
    this._port.callSync("player#event", this.getId(), EventType.ERROR, errorCode);
  }

  private _handleSizeClicked(e: PlayerEvent) {
    this._port.callSync("player#event", this.getId(), EventType.SIZE_CHANGE, e.detail as boolean);
  }

  private _handleEventPreventDefault(type: EventType) {

  }
}