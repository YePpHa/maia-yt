import { onPlayerCreated, onPlayerData, onSettingsReactRegister, onPlayerApiCall, onPlayerApiCallResponse } from "../IModule";
import { PlayerConfig, PlayerData, PlayerType } from "../../app/youtube/PlayerConfig";
import { Module } from "../Module";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
import { VideoDataChangeEvent } from "../../app/youtube/events";
import { ISettingsReact } from "../../settings/ISettings";
import { Settings as SettingsReact } from './settings';
import { Api } from "./api";
import { AutoNavigationState } from "../../app/youtube/PlayerApi";
const logger = new Logger("AutoPlayModule");

export enum AutoPlayMode {
  PAUSE = "pause",
  STOP = "stop"
}

export class AutoPlayModule extends Module implements onPlayerCreated, onPlayerData, onSettingsReactRegister, onPlayerApiCall {
  private _unstarted: {[key: string]: boolean} = {};
  private _autoNavigationCalls: {[key: string]: number} = {};
  private _ready: {[key: string]: boolean} = {};
  private _api: Api;

  getApi(): Api {
    if (!this._api) {
      this._api = new Api()
    }
    return this._api;
  }

  onPlayerData(player: Player, data: PlayerData): PlayerData {
    const api = this.getApi();

    data.suppress_autoplay_on_watch = false;
    if (api.isEnabled() && player.isDetailPage()) {
      if (api.getMode() === AutoPlayMode.STOP) {
        data.suppress_autoplay_on_watch = true;
        data.autoplay = "0";
      }
    } else if (api.isChannelEnabled() && player.isProfilePage()) {
      if (api.getChannelMode() === AutoPlayMode.STOP) {
        data.autoplay = "0";
      }
    }

    return data;
  }

  onPlayerApiCall(player: Player, name: string, data: PlayerData): onPlayerApiCallResponse|undefined|void {
    const id = player.getId();
    const videoLoaded = !!player.getVideoData().video_id;
    const loadDataReady = this._ready[id] && (name === "loadVideoByPlayerVars" || name === "cueVideoByPlayerVars");
    if (loadDataReady) {
      // Remove the ready object for player ID.
      delete this._ready[id];
    }
    if (loadDataReady && videoLoaded) {
      // Prevent the video data from being loaded twice in the player.
      logger.debug("Player stopped API %s from being called.", name);

      return { value: undefined };
    } else if (name === "loadVideoByPlayerVars") {
      // Cue video data if the prevent auto-play mode is STOP
      const api = this.getApi();

      const detailPage = api.isEnabled() && player.isDetailPage() && api.getMode() === AutoPlayMode.STOP;
      const profilePage = api.isChannelEnabled() && player.isProfilePage() && api.getChannelMode() === AutoPlayMode.STOP;

      if (!detailPage && !profilePage)
        return;

      logger.debug("Cue video data instead of loading it immediately (loadVideoByPlayerVars -> cueVideoByPlayerVars).");

      try {
        return {
          value: player.cueVideoByPlayerVars(data)
        };
      } catch (e) {
        console.error(e);
      }
    } else if (name === "setAutonavState") {
      const api = this.getApi();
      if (api.isAutoNavigationEnabled() && this._autoNavigationCalls[id] < 2) {
        this._autoNavigationCalls[id]++;
        const toggle = document.querySelector("#toggle");
        if (toggle) {
          if (api.getAutoNavigationState() === AutoNavigationState.ENABLED) {
            toggle.setAttribute("checked", "");
            toggle.setAttribute("active", "");
          } else {
            toggle.removeAttribute("checked");
            toggle.removeAttribute("active");
          }
        }
        return { value: undefined };
      }
    }
  }
  
  onPlayerCreated(player: Player): void {
    const api = this.getApi();
    const enabled: boolean = api.isEnabled();
    const detailPage: boolean = player.isDetailPage();

    const id: string = player.getId();

    if (detailPage) {
      if (enabled) {
        this._ready[id] = true;
        const mode: AutoPlayMode = api.getMode();
        if (mode === AutoPlayMode.PAUSE) {
          player.pause();
        }
      }
    } else if (player.isProfilePage()) {
      if (api.isChannelEnabled()) {
        const mode: AutoPlayMode = api.getChannelMode();
        if (mode === AutoPlayMode.PAUSE) {
          player.pause();
        }
      }
    }
    if (api.isAutoNavigationEnabled() && player.isDetailPage()) {
      logger.debug("Setting auto navigation state.");
      player.setAutoNavigationState(api.getAutoNavigationState());
    }
    this._unstarted[id] = true;
    this._autoNavigationCalls[id] = 0;

    player.addOnDisposeCallback(() => {
      delete this._unstarted[id];
    });
    this.getHandler()
      .listen(player, EventType.READY, () => {
        if (!enabled || !detailPage) return;
        player.setLoaded(true);
      })
      .listen(player, EventType.ENDED, () => {
        this._unstarted[id] = false;
      })
      .listen(player, EventType.PAUSED, () => {
        this._unstarted[id] = false;
      })
      .listen(player, EventType.AD_ENDED, () => {
        this._unstarted[id] = false;
      })
      .listen(player, EventType.AD_PAUSED, () => {
        this._unstarted[id] = false;
      })
      .listen(player, EventType.UNSTARTED, () => {
        this._unstarted[id] = true;
      })
      .listen(player, EventType.AD_UNSTARTED, () => {
        this._unstarted[id] = true;
      })
      .listen(player, EventType.PLAYED, () => this.onPlayed(player))
      .listen(player, EventType.AD_PLAYED, () => this.onPlayed(player));
    
    if (enabled && detailPage) {
      player.setLoaded(false);
    }
  }

  private onPlayed(player: Player) {
    const id = player.getId();
    const api = this.getApi();

    const unstarted: boolean = this._unstarted[id];

    if (api.isEnabled() && unstarted && player.isDetailPage()) {
      const mode: AutoPlayMode = api.getMode();
      if (mode === AutoPlayMode.PAUSE) {
        logger.debug("Preveting auto-play by pausing the video.");
        player.pause();
      }
    } else if (api.isChannelEnabled() && unstarted && player.isProfilePage()) {
      const mode: AutoPlayMode = api.getChannelMode();
      if (mode === AutoPlayMode.PAUSE) {
        logger.debug("Preveting auto-play by pausing the video.");
        player.pause();
      }
    }
    this._unstarted[id] = false;
  }

  onSettingsReactRegister(): ISettingsReact {
    return new SettingsReact(this.getApi());
  }
}