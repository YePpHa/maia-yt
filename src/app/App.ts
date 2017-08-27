import { Component } from '../libs/Component';
import { Channel } from '../libs/messaging/Channel';
import { ServicePort } from '../libs/messaging/ServicePort';
import { EventHandler } from '../libs/events/EventHandler';
import { EventType } from '../libs/messaging/events/EventType';
import { PortEvent } from '../libs/messaging/events/PortEvent';
import { PlayerConfig } from './youtube/PlayerConfig';
import { EventType as YouTubeEventType } from './youtube/EventType';

export class App extends Component {
  private _channel: Channel = new Channel('background');
  private _ports: ServicePort[] = [];

  constructor() {
    super();
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

  private _handleChannelConnect(e: PortEvent) {
    var port = new ServicePort(e.port);
    this._ports.push(port);
    if (this.isInDocument()) {
      port.enterDocument();
    }

    const modifyPlayerConfig = (playerConfig: PlayerConfig): PlayerConfig => {
      // removing channel branding e.g. Vevo
      delete playerConfig.args.iv_invideo_url;

      return playerConfig;
    }

    port.registerService("player#beforecreate", (playerId: string, playerConfig: PlayerConfig): any => {
      console.log("beforecreate", playerId, playerConfig.args);
      
      return modifyPlayerConfig(playerConfig);
    });
    port.registerService("player#update", (playerId: string, playerConfig: PlayerConfig): any => {
      console.log("update", playerId, playerConfig.args);

      return modifyPlayerConfig(playerConfig);
    });
    port.registerService("player#create", (playerId: string) => {
      console.log("create", playerId);
    });
    port.registerService("player#event", (playerId: string, eventType: YouTubeEventType, ...args: any[]) => {
      console.log("event", playerId, eventType, args);
    });
  }

  protected disposeInternal() {
    super.disposeInternal();

    this._channel.dispose();
    this._ports.forEach(port => {
      port.dispose();
    }, this);

    this._ports = [];
  }
}