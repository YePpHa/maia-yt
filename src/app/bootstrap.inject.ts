import { wrapFunction } from '../libs/property/observer';
import { ChannelPort } from '../libs/messaging/ChannelPort';
import { ServicePort } from '../libs/messaging/ServicePort';
import { PlayerFactory } from './youtube/PlayerFactory';
import { Player } from './youtube/Player';
import { PlayerConfig, PlayerConfigArguments } from './youtube/PlayerConfig';
import { v4 as uuidv4 } from 'uuid';

declare interface YTWindow extends Window {
  yt: { player: { Application: { create: Function } } };
  ytplayer: { config: PlayerConfig };
}

const port = new ChannelPort();
const servicePort = new ServicePort(port);

servicePort.enterDocument();

const players: {[key: string]: Player} = {};

const handlePlayerUpdate = (playerConfig: PlayerConfig): PlayerConfig => {
  if (servicePort.isDisposed()) {
    return playerConfig;
  }

  let elementId = playerConfig.attrs.id;
  if (players[elementId]) {
    let playerId = players[elementId].getId();
    playerConfig = servicePort.callSync("player#update", playerId,
      playerConfig) as PlayerConfig || playerConfig;
  }

  return playerConfig;
};

const handlePlayerCreate = (playerFactory: PlayerFactory, playerConfig: PlayerConfig, fn?: Function): any => {
  if (servicePort.isDisposed()) {
    if (fn) {
      return fn(playerConfig);
    }
    return;
  }
  
  let elementId = playerConfig.attrs.id;
  let playerId = uuidv4();

  // Send a beforecreate event to the core.
  let newplayerConfig = servicePort.callSync("player#beforecreate", playerId,
    playerConfig) as PlayerConfig;
  playerConfig = newplayerConfig || playerConfig;

  let playerApp = null;
  if (fn) {
    playerApp = fn(playerConfig);
  }
  let playerElement = document.getElementById(elementId);
  if (!playerElement) return playerApp;

  let player = playerFactory.createPlayer(playerElement, playerId);
  players[elementId] = player;

  player.enterDocument();

  let api = player.getApi();

  // If no initialization function.
  if (!fn && newplayerConfig) {
    api.loadVideoByPlayerVars(newplayerConfig.args);
  }

  servicePort.call("player#create", player.getId());

  return playerApp;
};

// factory stuff here
let playerFactory = new PlayerFactory(servicePort);
servicePort.addOnDisposeCallback(playerFactory.dispose, port);
playerFactory.enterDocument();

port.connect("background");

let win = window as YTWindow;

// If the player has already been created add it.
if (win.ytplayer && win.ytplayer.config
  && win.ytplayer.config.loaded) {
  let playerConfig = win.ytplayer.config;

  handlePlayerCreate(playerFactory, playerConfig);
}

// Hijack the yt.player.Application.create() method.
win.yt = win.yt || {};
win.ytplayer = win.ytplayer || {};

servicePort.addOnDisposeCallback(
  wrapFunction(win.yt, ['player', 'Application', 'create'],
    (fn: Function, self, args) => {
      const playerConfig = args[1] as PlayerConfig;

      return handlePlayerCreate(playerFactory, playerConfig,
          fn.bind(self, args[0]));
    }
  )
);

declare interface SPFRequest {
  onPartDone: (response: any) => void
}

declare interface SPFResponse {
  part: {
    page: string,
    player?: PlayerConfig
  },
  url: string
}

servicePort.addOnDisposeCallback(
  wrapFunction(win, ['spf', 'request'],
    (fn: Function, self, args) => {
      let req = args[1] as SPFRequest;
      let onPartDone = req.onPartDone;
      req.onPartDone = (response: SPFResponse) => {
        if (response.part.page === 'watch' && response.part.player) {
          response.part.player = handlePlayerUpdate(response.part.player);
        }

        onPartDone(response);
      };
      
      return fn.call(self, args[0], args[1]);
    }
  )
);