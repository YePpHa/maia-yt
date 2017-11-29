import { Component } from '../libs/Component';
import { Channel } from '../libs/messaging/Channel';
import { ServicePort } from '../libs/messaging/ServicePort';
import { EventHandler } from '../libs/events/EventHandler';
import { EventType } from '../libs/messaging/events/EventType';
import { PortEvent } from '../libs/messaging/events/PortEvent';
import { PlayerConfig, PlayerData } from './youtube/PlayerConfig';
import { EventType as YouTubeEventType } from './youtube/EventType';
import { IPlayer } from './player/IPlayer';
import { Player } from './player/Player';
import { QualityChangeEvent, RateChangeEvent, SizeChangeEvent, VolumeChangeEvent, CueRangeEvent, VideoDataChangeEvent } from './youtube/events';
import { Event } from '../libs/events/Event';
import { Logger } from '../libs/logging/Logger';
import { modules } from '../modules';
import { ModuleConstructor, Module, setStorage as setModuleStorage } from "../modules/Module";
import { onPlayerConfig, onPlayerCreated, onPlayerData, onPageNavigationFinish, onPlayerBeforeCreated, onPlayerApiCall, onPlayerApiCallResponse, onPlayerReady } from "../modules/IModule";
import { Storage } from '../libs/storage/Storage';
import { BrowserEvent } from '../libs/events/BrowserEvent';
import { PageNavigationDetail } from './youtube/PageNavigationDetail';
import { spf } from './youtube/spf';

const logger = new Logger('App');

export class App extends Component {
  private _channel: Channel = new Channel('background');
  private _ports: ServicePort[] = [];
  private _players: {[key: string]: Player} = {};
  private _modules: Module[] = [];

  private _storageLoaded: boolean = false;
  private _storageLoadedListeners: Function[] = [];

  constructor(storage: Storage) {
    super();

    setModuleStorage(storage);

    for (let i = 0; i < modules.length; i++) {
      let m = new modules[i]();
      this._modules.push(m);
    }
  }

  isStorageLoaded(): boolean {
    return this._storageLoaded;
  }

  async loadStorage(): Promise<void> {
    this._storageLoaded = false;
    for (let i = 0; i < this._modules.length; i++) {
      logger.debug("Loading storage for " + this._modules[i].getApi().getNamespace() + "...");
      await this._modules[i].getApi().updateCache();
    }
    this._storageLoaded = true;

    let fn;
    while (fn = this._storageLoadedListeners.shift()) {
      await fn();
    }
  }

  getModules(): Module[] {
    return this._modules;
  }

  enterDocument() {
    super.enterDocument();
    this._channel.enterDocument();

    this.getHandler()
      .listen(this._channel, EventType.CONNECT, this._handleChannelConnect, false)
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

    this._modules.forEach(m => {
      const instance = (m as any) as onPageNavigationFinish;
      if (typeof instance.onPageNavigationFinish === 'function') {
        instance.onPageNavigationFinish(pageDetail);
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

    this._modules.forEach(m => {
      const instance = (m as any) as onPageNavigationFinish;
      if (typeof instance.onPageNavigationFinish === 'function') {
        instance.onPageNavigationFinish(pageDetail);
      }
    });
  }
  
  private _handlePlayerBeforeCreate(id: string, elementId: string, port: ServicePort) {
    if (!this._players.hasOwnProperty(id)) {
      this._players[id] = new Player(id, elementId, port);

      this._modules.forEach(m => {
        const instance = (m as any) as onPlayerBeforeCreated;
        if (typeof instance.onPlayerBeforeCreated === 'function') {
          instance.onPlayerBeforeCreated(this._players[id]);
        }
      });
    }

    return this._players[id];
  }
  
  private _handlePlayerCreate(id: string, elementId: string, port: ServicePort) {
    if (!this._players.hasOwnProperty(id))
      throw new Error("Player with " + id + " has not been created.");

    this._modules.forEach(m => {
      const instance = (m as any) as onPlayerCreated;
      if (typeof instance.onPlayerCreated === 'function') {
        instance.onPlayerCreated(this._players[id]);
      }
    });

    return this._players[id];
  }

  private _handleOnPlayerReady(player: Player): void {
    this._modules.forEach(m => {
      const instance = (m as any) as onPlayerReady;
      if (typeof instance.onPlayerReady === 'function') {
        instance.onPlayerReady(player);
      }
    });
  }
  
  private _handleUpdatePlayerConfig(player: Player, config: PlayerConfig): PlayerConfig {
    player.setData(config.args);
    this._modules.forEach(m => {
      const instanceConfig = (m as any) as onPlayerConfig;
      const instanceData = (m as any) as onPlayerData;

      if (typeof instanceConfig.onPlayerConfig === 'function') {
        config = instanceConfig.onPlayerConfig(player, config);
      }
      if (typeof instanceData.onPlayerData === 'function') {
        config.args = instanceData.onPlayerData(player, config.args);
      }
      player.setData(config.args);
    });

    return config;
  }
  
  private _handleUpdatePlayerData(player: Player, data: PlayerData): PlayerData {
    player.setData(data);
    this._modules.forEach(m => {
      const instance = (m as any) as onPlayerData;
      if (typeof instance.onPlayerData === 'function') {
        data = instance.onPlayerData(player, data);
        player.setData(data);
      }
    });

    return data;
  }

  private _handlePlayerApiCall(player: Player, name: string, ...args: any[]) {
    for (let i = 0; i < this._modules.length; i++) {
      const instance = (this._modules[i] as any) as onPlayerApiCall;
      if (typeof instance.onPlayerApiCall === 'function') {
        let response = instance.onPlayerApiCall(player, name, ...args) as onPlayerApiCallResponse|undefined;
        if (response) return response;
      }
    }

    return undefined;
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
        case YouTubeEventType.QUALITY_CHANGE:
          evt = new QualityChangeEvent(args[0], player);
          break;
        case YouTubeEventType.RATE_CHANGE:
          evt = new RateChangeEvent(args[0], player);
          break;
        case YouTubeEventType.SIZE_CHANGE:
          evt = new SizeChangeEvent(args[0], player);
          break;
        case YouTubeEventType.VOLUME_CHANGE:
          evt = new VolumeChangeEvent(args[0], args[1], player);
          break;
        case YouTubeEventType.CUE_RANGE_ENTER:
        case YouTubeEventType.CUE_RANGE_EXIT:
          evt = new CueRangeEvent(args[0], type, player);
          break;
        case YouTubeEventType.VIDEO_DATA_CHANGE:
          evt = new VideoDataChangeEvent(args[0], args[1], player);
          break;
        default:
          evt = new Event(type, player);
      }

      player.dispatchEvent(evt);

      return evt.defaultPrevented;
    });
  }

  protected disposeInternal() {
    super.disposeInternal();

    this._channel.dispose();
    this._ports.forEach(port => port.dispose());
    this._modules.forEach(m => m.dispose());

    this._ports = [];
    this._modules = [];
  }
}