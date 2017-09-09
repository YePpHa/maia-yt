import { wrapFunction } from '../libs/property/observer';
import { ChannelPort } from '../libs/messaging/ChannelPort';
import { ServicePort } from '../libs/messaging/ServicePort';
import { PlayerFactory } from './youtube/PlayerFactory';
import { Player } from './youtube/Player';
import { PlayerConfig, PlayerData } from './youtube/PlayerConfig';
import { v4 as uuidv4 } from 'uuid';

declare interface YTWindow extends Window {
  yt: { player?: { Application?: { create?: Function } } };
  ytplayer: { config?: PlayerConfig };
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

const containsPlayerListeners = (obj: Object): boolean => {
  for (let key in obj) {
    if (key.substring(0, 8) === "ytPlayer")
      return true;
  }
  return false;
};

const getPlayerApi = (player: any):{
  element: Element|undefined,
  api: {[key: string]: Function}|undefined,
  internalApi: {[key: string]: Function}|undefined
} => {
  let element: Element|undefined = undefined;
  let api: {[key: string]: Function}|undefined = undefined;
  let internalApi: {[key: string]: Function}|undefined = undefined;

  for (let key in player) {
    if (!player.hasOwnProperty(key)
      || !player[key]
      || typeof player[key] !== 'object'
      || !player[key].hasOwnProperty("app")
      || !player[key].hasOwnProperty("playerType")) continue;
    let app = player[key];
    if (typeof app["getRootNode"] === "function") continue;

    for (let key in app) {
      if (typeof app[key] !== 'object' || !app[key] || key === "app") continue;

      if (app[key] instanceof Element) {
        element = app[key];
      } else if (app[key].hasOwnProperty("getApiInterface")) {
        api = app[key];
      } else if (app[key].hasOwnProperty("getInternalApiInterface")) {
        internalApi = app[key];
      }
    }
    break;
  }
  
  if (element && (element as any)["addEventListener"]) {
    const originalAddEventListener = (element as any)["addEventListener"];

    (element as any)["addEventListener"] = function(type: string, fn: string|Function): any {
      return originalAddEventListener.apply(api, arguments);
    };
  }

  return {
    element: element,
    api: api,
    internalApi: internalApi
  }
};

const getPlayerData = function(player: any) {
  for (let key in player) {
    if (!player.hasOwnProperty(key) || !player[key]) continue;
    if (typeof player[key] !== "object") continue;
    if (typeof player[key]["getCurrentTime"] !== "function") continue;
    if (typeof player[key]["getDuration"] !== "function") continue;
    if (typeof player[key]["getPlayerType"] !== "function") continue;

    let app = player[key];
    for (let key in app) {
      if (!app.hasOwnProperty(key) || !app[key]) continue;
      if (typeof app[key]["setData"] !== "function") continue;

      return app[key];
    }
  }
  return null;
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
  let newplayerConfig = servicePort.callSync("player#beforecreate", playerId, elementId,
    playerConfig) as PlayerConfig;
  playerConfig = newplayerConfig || playerConfig;

  let playerApp = null;
  if (fn) {
    playerApp = fn(playerConfig);
  }
  const playerData = getPlayerData(playerApp);
  const playerInstance = getPlayerApi(playerApp);

  const setData = playerData["setData"];
  playerData["setData"] = (data: PlayerData) => {
    let newData = servicePort.callSync("player#data-update", playerId,
      data) as PlayerData;
    setData.call(playerData, newData || data);
  };
  servicePort.addOnDisposeCallback(() => {
    playerData["setData"] = setData;
  });
  
  if (!playerInstance.element) return playerApp;

  let player = playerFactory.createPlayer(playerInstance.element, playerId);
  players[elementId] = player;

  player.enterDocument();

  let api = player.getApi();

  // If no initialization function.
  if (!fn && newplayerConfig) {
    api.loadVideoByPlayerVars(newplayerConfig.args);
  }

  servicePort.call("player#create", player.getId(), elementId, playerConfig);

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

      return handlePlayerCreate(
        playerFactory,
        playerConfig,
        fn.bind(self, args[0])
      );
    },
    undefined,
    true
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