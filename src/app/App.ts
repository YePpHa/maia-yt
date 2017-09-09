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
import { ModuleConstructor, Module } from "../modules/Module";
import { onPlayerConfig, onPlayerCreated, onPlayerData } from "../modules/IModule";
import { Storage } from '../libs/storage/Storage';

const logger = new Logger('App');

export class App extends Component {
  private _channel: Channel = new Channel('background');
  private _ports: ServicePort[] = [];
  private _players: {[key: string]: Player} = {};
  private _modules: Module[] = [];

  constructor(storage: Storage) {
    super();

    for (let i = 0; i < modules.length; i++) {
      let m = new modules[i](storage);
      this._modules.push(m);
    }
  }

  enterDocument() {
    super.enterDocument();
    this._channel.enterDocument();

    this.getHandler()
      .listen(this._channel, EventType.CONNECT, this._handleChannelConnect, false);
  }

  exitDocument() {
    super.exitDocument();

    this._channel.exitDocument();
    this._ports.forEach(port => {
      port.exitDocument();
    }, this);
  }
  
  private _handlePlayerCreate(id: string, port: ServicePort) {
    if (!this._players.hasOwnProperty(id)) {
      this._players[id] = new Player(id, port);

      this._modules.forEach(m => {
        const instance = (m as any) as onPlayerCreated;
        if (typeof instance.onPlayerCreated === 'function') {
          instance.onPlayerCreated(this._players[id]);
        }
      });
    }

    return this._players[id];
  }
  
  private _handleUpdatePlayerConfig(player: Player, config: PlayerConfig): PlayerConfig {
    this._modules.forEach(m => {
      const instanceConfig = (m as any) as onPlayerConfig;
      const instanceData = (m as any) as onPlayerData;

      if (typeof instanceConfig.onPlayerConfig === 'function') {
        config = instanceConfig.onPlayerConfig(player, config);
      }
      if (typeof instanceData.onPlayerData === 'function') {
        config.args = instanceData.onPlayerData(player, config.args);
      }
    });

    return config;
  }
  
  private _handleUpdatePlayerData(player: Player, data: PlayerData): PlayerData {
    this._modules.forEach(m => {
      const instance = (m as any) as onPlayerData;
      if (typeof instance.onPlayerData === 'function') {
        data = instance.onPlayerData(player, data);
      }
    });

    return data;
  }

  /**
   * Attempts to handle new connections from YouTube.
   * @param e the port event with the connected port.
   */
  private _handleChannelConnect(e: PortEvent) {
    var port = new ServicePort(e.port);
    this._ports.push(port);
    if (this.isInDocument()) {
      port.enterDocument();
    }

    port.registerService("player#beforecreate", (id: string, config: PlayerConfig): any => {
      if (this._players.hasOwnProperty(id))
        throw new Error("Player with " + id + " has already been created.");

      let player = this._handlePlayerCreate(id, port);

      logger.debug("Player %s has been created with config.", id);
      
      return this._handleUpdatePlayerConfig(player, config);
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
    port.registerService("player#create", (id: string) => {
      let player = this._handlePlayerCreate(id, port);
      if (player.isInitialized())
        throw new Error("Player with " + id + " has already been initialized.");

      logger.debug("Player %s has been initialized.", id);
      player.initialize();
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