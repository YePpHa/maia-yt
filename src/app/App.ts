import { Component } from './libs/Component';
import { Channel } from './libs/messaging/Channel';
import { ServicePort } from './libs/messaging/ServicePort';
import { EventType } from './libs/messaging/events/EventType';
import { PortEvent } from './libs/messaging/events/PortEvent';
import { PlayerConfig, PlayerData } from './youtube/PlayerConfig';
import { EventType as YouTubeEventType } from './youtube/EventType';
import { Player } from './player/Player';
import { QualityChangeEvent, RateChangeEvent, SizeChangeEvent, VolumeChangeEvent, CueRangeEvent, VideoDataChangeEvent } from './youtube/events';
import { Event } from './libs/events/Event';
import { Logger } from './libs/logging/Logger';
import {
  onPlayerApiCallResponse, onPlayerConfig, onPlayerDispose,
  onPlayerBeforeCreated, onPlayerCreated, onPlayerReady, onPlayerData,
  onPlayerApiCall, onPageNavigationFinish
} from "./modules/IModule";
import { BrowserEvent } from './libs/events/BrowserEvent';
import { PageNavigationDetail } from './youtube/PageNavigationDetail';
import { spf } from './youtube/spf';
import { ISettingsStorage } from './settings-storage/ISettingsStorage';

const logger = new Logger('App');

export class App extends Component {
  private _channel: Channel = new Channel('background');
  private _ports: ServicePort[] = [];
  private _players: {[key: string]: Player} = {};

  private _playerConfig: onPlayerConfig[];
  private _playerDispose: onPlayerDispose[];
  private _playerBeforeCreated: onPlayerBeforeCreated[];
  private _playerCreated: onPlayerCreated[];
  private _playerReady: onPlayerReady[];
  private _playerData: onPlayerData[];
  private _playerApiCall: onPlayerApiCall[];
  private _pageNavigationFinish: onPageNavigationFinish[];

  private _storageLoaded: boolean = false;
  private _storageLoadedListeners: Function[] = [];
  private _settingsStorages: ISettingsStorage[];

  constructor(
    playerConfig: onPlayerConfig[],
    playerDispose: onPlayerDispose[],
    playerBeforeCreated: onPlayerBeforeCreated[],
    playerCreated: onPlayerCreated[],
    playerReady: onPlayerReady[],
    playerData: onPlayerData[],
    playerApiCall: onPlayerApiCall[],
    pageNavigationFinish: onPageNavigationFinish[],
    settingsStorages: ISettingsStorage[]
  ) {
    super();

    this._playerConfig = playerConfig;
    this._playerDispose = playerDispose;
    this._playerBeforeCreated = playerBeforeCreated;
    this._playerCreated = playerCreated;
    this._playerReady = playerReady;
    this._playerData = playerData;
    this._playerApiCall = playerApiCall;
    this._pageNavigationFinish = pageNavigationFinish;

    this._settingsStorages = settingsStorages;
  }

  isStorageLoaded(): boolean {
    return this._storageLoaded;
  }

  async loadStorage(): Promise<void> {
    this._storageLoaded = false;

    for (let i = 0; i < this._settingsStorages.length; i++) {
      logger.debug("Loading storage for " + this._settingsStorages[i].constructor.name + "...");
      await this._settingsStorages[i].updateCache();
    }
    
    this._storageLoaded = true;

    let fn;
    while (fn = this._storageLoadedListeners.shift()) {
      await fn();
    }
  }

  enterDocument() {
    super.enterDocument();
    this._channel.enterDocument();

    this.getHandler()
      .listen(this._channel, EventType.Connect, this._handleChannelConnect, false)
      .listen(document.documentElement, "yt-navigate-finish", this._handleNavigateFinish, false)
      .listen(window, "spfdone", this._handleSPFDone, false);
  }

  exitDocument() {
    super.exitDocument();

    this._channel.exitDocument();
    this._ports.forEach(port => {
      port.exitDocument();
    }, this);
  }

  private _handleSPFDone(e: BrowserEvent): void {
    const detail = e.detail as spf.EventDetail;
    let pageDetail: PageNavigationDetail = {
      fromHistory: false,
      pageType: undefined
    };
    if (detail.response) {
      if ((detail.response as spf.MultipartResponse).type === "multipart") {
        let d = detail.response as spf.MultipartResponse;
        if (d.parts) {
          for (let i = 0; i < d.parts.length; i++) {
            pageDetail.pageType = d.parts[i].name || d.parts[i].title;
            let timing = d.parts[i].timing;
            if (timing) {
              pageDetail.fromHistory = !!timing['spfCached'];
            }
          }
        }
      } else {
        let d = detail.response as spf.SingleResponse;
        pageDetail.pageType = d.name || d.title;

        if (d.timing) {
          pageDetail.fromHistory = !!d.timing['spfCached'];
        }
      }
    }

    logger.debug("PageNavigationFinish - " + pageDetail.pageType + " - " + (pageDetail.fromHistory ? "true" : "false"));

    this._pageNavigationFinish.forEach(instance => {
      try {
        instance.onPageNavigationFinish(pageDetail);
      } catch (e) {
        logger.error(e);
      }
    });
  }

  private _handleNavigateFinish(e: BrowserEvent): void {
    const detail = e.detail as PageNavigationDetail;
    if (!detail) return;
    let pageDetail: PageNavigationDetail = {
      fromHistory: detail.fromHistory,
      pageType: detail.pageType
    };

    logger.debug("PageNavigationFinish - " + pageDetail.pageType + " - " + (pageDetail.fromHistory ? "true" : "false"));

    this._pageNavigationFinish.forEach(instance => {
      try {
        instance.onPageNavigationFinish(pageDetail);
      } catch (e) {
        logger.error(e);
      }
    });
  }
  
  private _handlePlayerBeforeCreate(id: string, elementId: string, port: ServicePort) {
    if (!this._players.hasOwnProperty(id)) {
      this._players[id] = new Player(id, elementId, port);

      for (const instance of this._playerBeforeCreated) {
        try {
          instance.onPlayerBeforeCreated(this._players[id]);
        } catch (e) {
          logger.error(e);
        }
      }
    }

    return this._players[id];
  }
  
  private _handlePlayerCreate(id: string, elementId: string, port: ServicePort) {
    if (!this._players.hasOwnProperty(id))
      throw new Error("Player with " + id + " has not been created.");

    for (const instance of this._playerCreated) {
      try {
        instance.onPlayerCreated(this._players[id]);
      } catch (e) {
        logger.error(e);
      }
    }

    return this._players[id];
  }

  private _handleOnPlayerReady(player: Player): void {
    for (const instance of this._playerReady) {
      try {
        instance.onPlayerReady(player);
      } catch (e) {
        logger.error(e);
      }
    }
  }
  
  private _handleUpdatePlayerConfig(player: Player, config: PlayerConfig): PlayerConfig {
    player.setData(config.args);

    for (const instance of this._playerConfig) {
      try {
        config = instance.onPlayerConfig(player, config);
        player.setData(config.args);
      } catch (e) {
        logger.error(e);
      }
    }

    for (const instance of this._playerData) {
      try {
        config.args = instance.onPlayerData(player, config.args);
        player.setData(config.args);
      } catch (e) {
        logger.error(e);
      }
    }

    return config;
  }
  
  private _handleUpdatePlayerData(player: Player, data: PlayerData): PlayerData {
    player.setData(data);

    for (const instance of this._playerData) {
      try {
        data = instance.onPlayerData(player, data);
        player.setData(data);
      } catch (e) {
        logger.error(e);
      }
    }

    return data;
  }

  private _handlePlayerApiCall(player: Player, name: string, ...args: any[]): onPlayerApiCallResponse|undefined {
    for (const instance of this._playerApiCall) {
      try {
        let response = instance.onPlayerApiCall(player, name, ...args) as onPlayerApiCallResponse|undefined;
        if (response) return response;
      } catch (e) {
        logger.error(e);
      }
    }

    return undefined;
  }

  private _handlePlayerDispose(player: Player): void {
    for (const instance of this._playerDispose) {
      try {
        instance.onPlayerDispose(player);
      } catch (e) {
        logger.error(e);
      }
    }
  }

  /**
   * Attempts to handle new connections from YouTube.
   * @param e the port event with the connected port.
   */
  private _handleChannelConnect(e: PortEvent) {
    const port = new ServicePort(e.port);
    this._ports.push(port);
    if (this.isInDocument()) {
      port.enterDocument();
    }

    port.registerService("logger#debug", (msg: string, ...args: any[]) => {
      logger.debug(msg, ...args);
    });

    port.registerService("settings#ensureLoaded", async () => {
      if (!this.isStorageLoaded()) {
        await new Promise((resolve) => {
          this._storageLoadedListeners.push(resolve);
        });
      }
    });

    port.registerService("player#beforecreate", (id: string, elementId: string, config: PlayerConfig): any => {
      if (this._players.hasOwnProperty(id))
        throw new Error("Player with " + id + " has already been created.");

      let player = this._handlePlayerBeforeCreate(id, elementId, port);

      logger.debug("Player %s has been created with config.", id);
      
      return this._handleUpdatePlayerConfig(player, config);
    });
    port.registerService("player#create", (id: string, elementId: string, config: PlayerConfig) => {
      let player = this._handlePlayerCreate(id, elementId, port);
      if (player.isReady())
        throw new Error("Player with " + id + " has already been initialized.");

      logger.debug("Player %s has been initialized.", id);
      player.ready();

      return this._handleOnPlayerReady(this._players[id]);
    });
    port.registerService("player#update", (id: string, config: PlayerConfig): any => {
      if (!this._players.hasOwnProperty(id))
        throw new Error("Player with " + id + " doesn't exist.");

      logger.debug("Player %s has been updated with new config.", id);
      return this._handleUpdatePlayerConfig(this._players[id], config);
    });
    port.registerService("player#data-update", (id: string, data: PlayerData): any => {
      if (!this._players.hasOwnProperty(id))
        throw new Error("Player with " + id + " doesn't exist.");

      logger.debug("Player %s has been updated with new data.", id);
      return this._handleUpdatePlayerData(this._players[id], data);
    });
    port.registerService("player#api-call", (id: string, name: string, ...args: any[]) => {
      if (!this._players.hasOwnProperty(id))
        throw new Error("Player with " + id + " doesn't exist.");
      logger.debug("Player %s API -> %s", id, name);

      return this._handlePlayerApiCall(this._players[id], name, ...args);
    });
    port.registerService("player#event", (id: string, type: YouTubeEventType, ...args: any[]) => {
      if (!this._players.hasOwnProperty(id))
        throw new Error("Player with " + id + " doesn't exist.");
      let player = this._players[id];

      logger.debug("Player %s dispatched event %s with arguments %j", id, type, args);

      let evt: Event;
      switch (type) {
        case YouTubeEventType.QualityChange:
          evt = new QualityChangeEvent(args[0], player);
          break;
        case YouTubeEventType.RateChange:
          evt = new RateChangeEvent(args[0], player);
          break;
        case YouTubeEventType.SizeChange:
          evt = new SizeChangeEvent(args[0], player);
          break;
        case YouTubeEventType.VolumeChange:
          evt = new VolumeChangeEvent(args[0], args[1], player);
          break;
        case YouTubeEventType.CueRangeEnter:
        case YouTubeEventType.CueRangeExit:
          evt = new CueRangeEvent(args[0], type, player);
          break;
        case YouTubeEventType.VideoDataChange:
          evt = new VideoDataChangeEvent(args[0], args[1], player);
          break;
        default:
          evt = new Event(type, player);
      }

      player.dispatchEvent(evt);

      if (type === "destroy") {
        this._handlePlayerDispose(player);
      }

      return evt.defaultPrevented;
    });
  }

  protected disposeInternal() {
    super.disposeInternal();

    this._channel.dispose();

    for (const port of this._ports) {
      port.dispose();
    }
    this._ports = [];

    for (const impl of this._playerDispose) {
      const playerIds = Object.keys(this._players);
      for (const id of playerIds) {
        impl.onPlayerDispose(this._players[id]);
      }
    }
    this._players = {};
  }
}