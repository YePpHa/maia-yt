import { ServicePort } from '../libs/messaging/ServicePort';
import { ElementComponent } from '../libs/ElementComponent';
import { PlayerApi, PlayerState, PlaybackQuality } from './PlayerApi';
import { PlayerListenable, PlayerEvent } from './PlayerListenable';
import { EventType } from './EventType';
import { Event } from '../libs/events/Event';
import { PlayerData, PlayerConfig } from "./PlayerConfig";

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

declare interface VideoDataChangeDetail {
  playertype: number;
  type: string;
}

declare interface PlayVideoDetail {
  listId: string|null;
  sessionData: {[key: string]: string|boolean|number};
  videoId: string;
  watchEndpoint: string|null;
}

export class Player extends ElementComponent {
  private _id: string;
  private _element: Element;
  private _config: PlayerConfig;
  private _port: ServicePort;

  private _api?: PlayerApi;

  private _youtubeEvents: {[key: string]: Function} = {};
  private _preventDefaultEvents: {[key: string]: boolean} = {};

  private _playerListenable?: PlayerListenable;

  constructor(id: string, element: Element, playerConfig: PlayerConfig, port: ServicePort) {
    super();
    this._id = id;
    this._element = element;
    this._config = playerConfig;
    this._port = port;

    // Wrap the player methods to allow for modifying the input.
    const api = this.getApi();
    for (let key in api) {
      if (api.hasOwnProperty(key)) {
        (this._element as any)[key] = (...args: any[]) => this.callApi(key, ...args);
      }
    }
  }
  
  protected disposeInternal() {
    super.disposeInternal();

    const api = this.getApi();
    for (let key in api) {
      if (api.hasOwnProperty(key)) {
        (this._element as any)[key] = (api as any)[key];
      }
    }

    if (this._playerListenable) {
      this._playerListenable.dispose();
    }

    delete this._playerListenable;
    delete this._element;
    delete this._api;
    delete this._port;
  }

  getElement(): Element {
    return this._element;
  }
  
  callApi(name: string, ...args: any[]): any {
    let returnValue: { value: any }|undefined = undefined;
    switch (name) {
      case "addEventListener":
        this._addEventListener(args[0], args[1]);
        return;
      case "removeEventListener":
        this._removeEventListener(args[0], args[1]);
        return;
      case "destroy":
        this._fireEvent(new PlayerEvent(null, "destroy", this), EventType.Destroy);
        break;
      case "loadVideoByPlayerVars":
      case "cueVideoByPlayerVars":
      case "updateVideoData":
        args[0] = this._port.callSync("player#data-update", this._id, args[0]) as PlayerData || args[0];
      default:
        returnValue = this._port.callSync("player#api-call", this._id, name, ...args);
        break;
    }

    if (!returnValue) {
      const api = this.getApi();
      let value = (api as any)[name](...args);

      return value;
    } else {
      return returnValue.value;
    }
  }
  
  private _addEventListener(type: string, fn: Function|string): void {
    const api = this.getApi();
    if (this.isDisposed()) {
      api.addEventListener(type, fn);
    } else {
      this.getPlayerListenable().ytAddEventListener(type, fn);
    }
  }
  
  private _removeEventListener(type: string, fn: Function|string): void {
    const api = this.getApi();
    if (this.isDisposed()) {
      api.removeEventListener(type, fn);
    } else {
      this.getPlayerListenable().ytRemoveEventListener(type, fn);
    }
  }

  public getPlayerListenable(): PlayerListenable {
    if (!this._playerListenable) {
      this._playerListenable = new PlayerListenable(this.getApi());
    }
    return this._playerListenable;
  }

  enterDocument() {
    super.enterDocument();

    let player = this.getPlayerListenable();

    this.getHandler()
      .listen(player, "onReady", this._handleOnReady, false)
      .listen(player, "onStateChange", this._handleStateChange, false)
      .listen(player, "onVolumeChange", this._handleVolumeChange, false)
      .listen(player, "onFullscreenChange", this._handleFullscreenChange, false)
      .listen(player, "onPlaybackQualityChange", this._handlePlaybackQualityChange, false)
      .listen(player, "onPlaybackRateChange", this._handlePlaybackRateChange, false)
      .listen(player, "onApiChange", this._handleApiChange, false)
      .listen(player, "onError", this._handleError, false)
      .listen(player, "onDetailedError", this._handleDetailedError, false)
      .listen(player, "SIZE_CLICKED", this._handleSizeClicked, false)
      .listen(player, "onAdStateChange", this._handleAdStateChange, false)
      .listen(player, "onSharePanelOpened", this._handleSharePanelOpened, false)
      .listen(player, "onPlaybackAudioChange", this._handlePlaybackAudioChange, false)
      .listen(player, "onVideoDataChange", this._handleVideoDataChange, false)
      .listen(player, "onPlaylistUpdate", this._handlePlaylistUpdate, false)
      .listen(player, "onCueRangeEnter", this._handleCueRangeEnter, false)
      .listen(player, "onCueRangeExit", this._handleCueRangeExit, false)
      .listen(player, "onCueRangeMarkersUpdated", this._handleCueRangeMarkersUpdated, false)
      .listen(player, "onCueRangesAdded", this._handleCueRangesAdded, false)
      .listen(player, "onCueRangesRemoved", this._handleCueRangesRemoved, false)
      .listen(player, "CONNECTION_ISSUE", this._handleConnectionIssue, false)
      .listen(player, "SHARE_CLICKED", this._handleShareClicked, false)
      .listen(player, "WATCH_LATER_VIDEO_ADDED", this._handleWatchLaterVideoAdded, false)
      .listen(player, "WATCH_LATER_VIDEO_REMOVED", this._handleWatchLaterVideoRemoved, false)
      .listen(player, "WATCH_LATER_ERROR", this._handleWatchLaterError, false)
      .listen(player, "onLoadProgress", this._handleLoadProgress, false)
      .listen(player, "onVideoProgress", this._handleVideoProgress, false)
      .listen(player, "onReloadRequired", this._handleReloadRequired, false)
      .listen(player, "onPlayVideo", this._handlePlayVideo, false)
      .listen(player, "onAutonavCoundownStarted", this._handleAutonavCoundownStarted, false)
      .listen(player, "onPlaylistNext", console.log.bind(console, "onPlaylistNext"), false)
      .listen(player, "onPlaylistPrevious", console.log.bind(console, "onPlaylistPrevious"), false)
      .listen(player, "onAdAnnounce", console.log.bind(console, "onAdAnnounce"), false)
      .listen(player, "onLogClientVeCreated", console.log.bind(console, "onLogClientVeCreated"), false)
      .listen(player, "onLogServerVeCreated", console.log.bind(console, "onLogServerVeCreated"), false)
      .listen(player, "onLogVeClicked", console.log.bind(console, "onLogVeClicked"), false)
      .listen(player, "onLogVesShown", console.log.bind(console, "onLogVesShown"), false)
      .listen(player, "onPlaShelfInfoCardsReady", console.log.bind(console, "onPlaShelfInfoCardsReady"), false)
      .listen(player, "onScreenChanged", console.log.bind(console, "onScreenChanged"), false)
      .listen(player, "onFeedbackStartRequest", console.log.bind(console, "onFeedbackStartRequest"), false)
      .listen(player, "onFeedbackArticleRequest", console.log.bind(console, "onFeedbackArticleRequest"), false)
      .listen(player, "onYpcContentRequest", console.log.bind(console, "onYpcContentRequest"), false)
      .listen(player, "onAutonavChangeRequest", console.log.bind(console, "onAutonavChangeRequest"), false)
      .listen(player, "onAutonavPauseRequest", console.log.bind(console, "onAutonavPauseRequest"), false)
      .listen(player, "SUBSCRIBE", console.log.bind(console, "SUBSCRIBE"), false)
      .listen(player, "UNSUBSCRIBE", console.log.bind(console, "UNSUBSCRIBE"), false)
      .listen(player, "onYtShowToast", console.log.bind(console, "onYtShowToast"), false);
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
      if (!player) throw new Error("Player (" + this.getId() + ") is not initialized.");

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

  setLoaded(loaded: boolean): void {
    Object.defineProperty(this._config, 'loaded', {
      "get": () => loaded,
      "set": () => {},
      "enumerable": true,
      "configurable": true
    });
  }

  private _fireEvent(e: Event, type: EventType, ...args: any[]) {
    const preventDefault = this._port.callSync("player#event", this.getId(), type, ...args) as boolean;

    if (preventDefault) {
      e.preventDefault();
    }
  }
  
  private _handleOnReady(e: PlayerEvent<any>) {
    this._fireEvent(e, EventType.Ready);
  }

  private _handleStateChange(e: PlayerEvent<PlayerState>) {
    let state = e.detail;

    let type: EventType;
    switch (state) {
      case -1:
        type = EventType.Unstarted;
        break;
      case 0:
        type = EventType.Ended;
        break;
      case 1:
        type = EventType.Played;
        break;
      case 2:
        type = EventType.Paused;
        break;
      case 3:
        type = EventType.Buffering;
        break;
      case 5:
        type = EventType.Cued;
        break;
      default:
        return;
    }
  
    this._fireEvent(e, type);
  }
  
  private _handleVolumeChange(e: PlayerEvent<VolumeChangeDetail>) {
    let detail = e.detail;
    this._fireEvent(e, EventType.VolumeChange, detail.volume, detail.muted);
  }
    
  private _handleFullscreenChange(e: PlayerEvent<FullscreenChangeDetail>) {
    let detail = e.detail;
    this._fireEvent(e, EventType.FullscreenChange, detail.fullscreen);
  }

  private _handlePlaybackQualityChange(e: PlayerEvent<PlaybackQuality>) {
    let quality = e.detail;
    this._fireEvent(e, EventType.QualityChange, quality);
  }

  private _handlePlaybackRateChange(e: PlayerEvent<number>) {
    let rate = e.detail;
    this._fireEvent(e, EventType.RateChange, rate);
  }

  private _handleApiChange(e: PlayerEvent<any>) {
    this._fireEvent(e, EventType.ApiChange);
  }

  private _handleError(e: PlayerEvent<number>) {
    let errorCode = e.detail;
    this._fireEvent(e, EventType.Error, errorCode);
  }
  
  private _handleDetailedError(e: PlayerEvent<any>) {
    console.log("DetailedError", e.detail);
  }

  private _handleSizeClicked(e: PlayerEvent<boolean>) {
    this._fireEvent(e, EventType.SizeChange, e.detail);
  }
  
  private _handleAdStateChange(e: PlayerEvent<PlayerState>) {
    let state = e.detail;
    
    let type: EventType;
    switch (state) {
      case -1:
        type = EventType.AdUnstarted;
        break;
      case 0:
        type = EventType.AdEnded;
        break;
      case 1:
        type = EventType.AdPlayed;
        break;
      case 2:
        type = EventType.AdPaused;
        break;
      case 3:
        type = EventType.AdBuffering;
        break;
      case 5:
        type = EventType.AdCued;
        break;
      default:
        return;
    }
  
    this._fireEvent(e, type);
  }

  private _handleSharePanelOpened(e: PlayerEvent<any>) {
    this._fireEvent(e, EventType.SharePanelOpened);
  }

  private _handlePlaybackAudioChange(e: PlayerEvent<any>) {
    console.log("PlaybackAudioChange", e.detail);
  }

  private _handleVideoDataChange(e: PlayerEvent<VideoDataChangeDetail>) {
    const data = e.detail;
    this._fireEvent(e, EventType.VideoDataChange, data.type, data.playertype);
  }
  
  private _handlePlaylistUpdate(e: PlayerEvent<any>) {
    this._fireEvent(e, EventType.PlaylistUpdate);
  }
  
  private _handleCueRangeEnter(e: PlayerEvent<any>) {
    this._fireEvent(e, EventType.CueRangeEnter, e.detail);
  }

  private _handleCueRangeExit(e: PlayerEvent<any>) {
    this._fireEvent(e, EventType.CueRangeExit, e.detail);
  }

  private _handleCueRangeMarkersUpdated(e: PlayerEvent<any>) {
    console.log("CueRangeMarkersUpdated", e.detail);
  }

  private _handleCueRangesAdded(e: PlayerEvent<any>) {
    console.log("CueRangesAdded", e.detail);
  }

  private _handleCueRangesRemoved(e: PlayerEvent<any>) {
    console.log("CueRangesRemoved", e.detail);
  }

  private _handleConnectionIssue(e: PlayerEvent<any>) {
    this._fireEvent(e, EventType.ConnectionIssue);
  }

  private _handleShareClicked(e: PlayerEvent<any>) {
    this._fireEvent(e, EventType.ShareClicked);
  }

  private _handleWatchLaterVideoAdded(e: PlayerEvent<any>) {
    console.log("WatchLaterVideoAdded", e.detail);
  }

  private _handleWatchLaterVideoRemoved(e: PlayerEvent<any>) {
    console.log("WatchLaterVideoRemoved", e.detail);
  }

  private _handleWatchLaterError(e: PlayerEvent<any>) {
    console.log("WatchLaterError", e.detail);
  }

  private _handleLoadProgress(e: PlayerEvent<number>) {
    this._fireEvent(e, EventType.LoadProgress, e.detail);
  }

  private _handleVideoProgress(e: PlayerEvent<number>) {
    this._fireEvent(e, EventType.VideoProgress, e.detail);
  }

  private _handleReloadRequired(e: PlayerEvent<any>) {
    this._fireEvent(e, EventType.ReloadRequired);
  }

  private _handlePlayVideo(e: PlayerEvent<PlayVideoDetail>) {
    this._fireEvent(e, EventType.PlayVideo, e.detail);
  }

  private _handleAutonavCoundownStarted(e: PlayerEvent<number>) {
    this._fireEvent(e, EventType.AutonavCoundownStarted, e.detail);
  }
}