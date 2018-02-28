import { wrapFunction } from './libs/property/observer';
import { ChannelPort } from './libs/messaging/ChannelPort';
import { ServicePort } from './libs/messaging/ServicePort';
import { PlayerFactory } from './youtube/PlayerFactory';
import { Player } from './youtube/Player';
import { PlayerConfig, PlayerData, PlayerType } from './youtube/PlayerConfig';
import { v4 as uuidv4 } from 'uuid';

declare interface YTWindow extends Window {
  yt: {
    player?: {
      Application?: {
        create?: Function
      }
    }
    config_?: {
      TIMING_AFT_KEYS?: string[]
    }
  };
  ytplayer: { config?: PlayerConfig };
  _yt_player: any;
}

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

const getPlayerApi = (player: any): {
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

/**
 * Whether the auto-play patch has been applied.
 */
let appliedAutoPlayPatch = false;

/**
 * Fixes the autoplay setting. Currently YouTube doesn't use the autoplay if the
 * player is `detailpage`, which we need on /watch. This patch will fix it.
 */
const applyAutoPlayPatch = () => {
  if (appliedAutoPlayPatch) return;
  appliedAutoPlayPatch = true;
  let win = window as YTWindow;
  for (let key in win._yt_player) {
    if (win._yt_player.hasOwnProperty(key) && typeof win._yt_player[key] === "function") {
      const fn = win._yt_player[key];
      const match = fn.toString().match(/{this\.([a-zA-Z0-9$_]+)=this\.([a-zA-Z0-9$_]+);this\.([a-zA-Z0-9$_]+)=this\.([a-zA-Z0-9$_]+)}/);
      if (match && match[1] === match[2] && match[3] === match[4]) {
        win._yt_player[key] = function(...args: any[]) {
          const constructor = this.constructor.toString();
          const match = constructor.match(/this\.([a-zA-Z0-9$_]+)\=[^;]+\.autoplay/);

          let autoplay = true;

          if (match && match[1]) {
            Object.defineProperty(this, match[1], {
              "set": () => {},
              "get": () => autoplay,
              "enumerable": true,
              "configurable": true
            });
          }

          const returnValue = fn.apply(this, args);
          for (let key in this) {
            if (typeof this[key] === "function") {
              const fn = this[key];
              if (fn.toString().indexOf('video_id') !== -1) {
                this[key] = function(...args: any[]) {
                  if (args.length > 0) {
                    const config = args[0];
                    if (config && config.hasOwnProperty("autoplay")) {
                      autoplay = config["autoplay"] !== "0";
                    }
                  }
                  return fn.apply(this, args);
                };
              }
            }
          }
          return returnValue;
        };
        win._yt_player[key].prototype = fn.prototype;
      }
    }
  }
};

const handlePlayerCreate = async (playerFactory: PlayerFactory, playerConfig: PlayerConfig, fn?: Function): Promise<any> => {
  if (servicePort.isDisposed()) {
    if (fn) {
      return fn(playerConfig);
    }
    return;
  }
  
  let elementId = playerConfig.attrs.id;
  let playerId = uuidv4();
  
  await servicePort.call("settings#ensureLoaded");

  // Send a beforecreate event to the core.
  let newplayerConfig = servicePort.callSync("player#beforecreate", playerId, elementId,
    playerConfig) as PlayerConfig;
  Object.assign(playerConfig, newplayerConfig);

   // Apply auto-play patch
  if (playerConfig.args.hasOwnProperty("autoplay")) {
    if (playerConfig.args.el === PlayerType.DetailPage || !playerConfig.args.el) {
      applyAutoPlayPatch();
    }
  }

  let playerApp = null;
  if (fn) {
    playerApp = fn(playerConfig);


  }
  const playerData = getPlayerData(playerApp);
  let playerInstance = getPlayerApi(playerApp);

  if (playerData) {
    const setData = playerData["setData"];
    playerData["setData"] = (data: PlayerData) => {
      let newData: PlayerData|undefined = undefined;
      newData = servicePort.callSync("player#data-update", playerId, data) as PlayerData;
      setData.call(playerData, newData || data);
    };
    servicePort.addOnDisposeCallback(() => {
      playerData["setData"] = setData;
    });
  } else {
    const el = document.getElementById(elementId);
    if (el) {
      playerInstance = {
        element: el,
        api: undefined,
        internalApi: undefined
      };
    }
  }
  
  if (!playerInstance || !playerInstance.element) return playerApp;

  let player = playerFactory.createPlayer(playerInstance.element, playerConfig, playerId);
  players[elementId] = player;

  player.enterDocument();

  // If no initialization function.
  if (!fn && newplayerConfig) {
    player.callApi("loadVideoByPlayerVars", newplayerConfig.args);
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

  servicePort.call("logger#debug", "Player already initialized.");
  handlePlayerCreate(playerFactory, playerConfig);
}

// Hijack the yt.player.Application.create() method.
win.yt = win.yt || {};
win.ytplayer = win.ytplayer || {};

servicePort.addOnDisposeCallback(
  wrapFunction(win.ytplayer, ['load'],
    async (fn: Function, self, args) => {
      await win.yt.player!.Application!.create!("player-api", win.ytplayer.config);
      win.ytplayer.config!.loaded = true;
    },
    undefined,
    true
  )
);

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