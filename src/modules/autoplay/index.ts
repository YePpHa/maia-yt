import { onPlayerCreated, onPlayerData, onSettingsReactRegister, onPlayerApiCall, onPlayerApiCallResponse } from "../IModule";
import { PlayerConfig, PlayerData } from "../../app/youtube/PlayerConfig";
import { Module } from "../Module";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
import { ISettingsReact } from "../../settings/ISettings";
import { Settings as SettingsReact } from './settings';
import { Api } from "./api";
const logger = new Logger("AutoPlayModule");

export enum AutoPlayMode {
  PAUSE = "pause",
  STOP = "stop"
}

export class AutoPlayModule extends Module implements onPlayerCreated, onPlayerData, onSettingsReactRegister, onPlayerApiCall {
  private _api: Api;

  // Ready variable to prevent loadVideoByPlayerVars from being called due to
  // the ytplayer.config.loaded being false.
  private _ready: {[key: string]: boolean} = {};

  getApi(): Api {
    if (!this._api) {
      this._api = new Api()
    }
    return this._api;
  }

  private _preventAutoPlay(player: Player): void {
    const api = this.getApi();
    const enabled: boolean = api.isEnabled();
    const detailPage: boolean = player.isDetailPage();

    const id: string = player.getId();

    if (detailPage) {
      if (enabled) {
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

    if (player.isReady()) {
      this._preventAutoPlay(player);
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
      player.setLoaded(true);

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
    }
  }
  
  onPlayerCreated(player: Player): void {
    const api = this.getApi();
    const enabled: boolean = api.isEnabled();
    const detailPage: boolean = player.isDetailPage();

    const id: string = player.getId();

    if (detailPage && enabled) {
      this._ready[id] = true;
    }
    this._preventAutoPlay(player);
    
    if (enabled && detailPage) {
      // Prevent the watch-specific code from calling `playVideo()`. If `loaded`
      // is false it will call `loadVideoByPlayerVars` instead which is easier
      // to handle as `playVideo()` can come from the user and
      // `loadVideoByPlayerVars` wont.
      player.setLoaded(false);
    }
  }

  onSettingsReactRegister(): ISettingsReact {
    return new SettingsReact(this.getApi());
  }
}