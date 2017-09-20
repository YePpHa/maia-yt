import { onPlayerConfig, onPlayerCreated, onPlayerData, onSettingsReactRegister, onPlayerApiCall, onPlayerApiCallResponse } from "../IModule";
import { PlayerConfig, PlayerData, PlayerType } from "../../app/youtube/PlayerConfig";
import { Module } from "../Module";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
import { VideoDataChangeEvent } from "../../app/youtube/events";
import { ISettingsReact } from "../../settings/ISettings";
import { Settings as SettingsReact } from './settings';
import { Api } from "./api";
const logger = new Logger("AutoPlayModule");

export enum AutoPlayMode {
  PAUSE = "pause",
  STOP = "stop"
}

export class AutoPlayModule extends Module implements onPlayerCreated, onPlayerData, onSettingsReactRegister, onPlayerApiCall {
  public name: string = "AutoPlay";

  private _unstarted: {[key: string]: boolean} = {};
  private _ready: {[key: string]: boolean} = {};
  private _api: Api;

  getApi(): Api {
    if (!this._api) {
      this._api = new Api(this.getStorage());
    }
    return this._api;
  }

  isDetailPage() {
    return location.pathname === "/watch";
  }

  onPlayerData(player: Player, data: PlayerData): PlayerData {
    const api = this.getApi();
    const enabled: boolean = api.isEnabled();
    const detailPage: boolean = this.isDetailPage();

    if (enabled && detailPage) {
      if (this.getApi().getMode() === AutoPlayMode.STOP) {
        data.autoplay = "0";
      }
    }

    return data;
  }

  onPlayerApiCall(player: Player, name: string, data: PlayerData): onPlayerApiCallResponse|undefined {
    const id = player.getId();
    if (this._ready[id] && (name === "loadVideoByPlayerVars" || name === "cueVideoByPlayerVars")) {
      logger.debug("Player stopped API %s from being called.", name);
      delete this._ready[id];
      return { value: undefined };
    } else {
      if (name !== "loadVideoByPlayerVars") return;
      const api = this.getApi();
      const enabled: boolean = api.isEnabled();
      const detailPage: boolean = this.isDetailPage();
      if (!enabled || !detailPage) return;

      const mode: AutoPlayMode = api.getMode();
      if (mode !== AutoPlayMode.STOP) return;

      try {
        return {
          value: player.cueVideoByPlayerVars(data)
        };
      } catch (e) {
        console.error(e);
        return;
      }
    }
  }
  
  onPlayerCreated(player: Player): void {
    const api = this.getApi();
    const enabled: boolean = api.isEnabled();
    const detailPage: boolean = this.isDetailPage();

    const id: string = player.getId();

    if (enabled && detailPage) {
      this._ready[id] = true;
      const mode: AutoPlayMode = api.getMode();
      if (mode === AutoPlayMode.PAUSE) {
        player.pause();
      }
    }

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

    const enabled: boolean = api.isEnabled();
    const detailPage: boolean = this.isDetailPage();

    if (enabled && this._unstarted[id] && detailPage) {
      const mode: AutoPlayMode = api.getMode();
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