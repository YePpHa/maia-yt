import { onPlayerConfig, onPlayerCreated, onPlayerData } from "../IModule";
import { PlayerConfig, PlayerData } from "../../app/youtube/PlayerConfig";
import { Module } from "../Module";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
import { VideoDataChangeEvent } from "../../app/youtube/events";
const logger = new Logger("AutoPlayModule");

export enum AutoPlayMode {
  PAUSE,
  STOP
}

export class AutoPlayModule extends Module implements onPlayerCreated, onPlayerData, onPlayerConfig {
  public name: string = "AutoPlay";

  private _unstarted: {[key: string]: boolean} = {};
  private _stopping: {[key: string]: boolean} = {};

  isEnabled(): boolean {
    return this.getStorage().get('enabled', false);
  }

  isEmbeddedPlayer() {
    return location.pathname.substring(0, 7) === "/embed/";
  }

  getMode(): AutoPlayMode {
    return this.getStorage().get('mode', AutoPlayMode.PAUSE);
  }

  private _stopPlayer(player: Player) {
    const el = document.getElementById(player.getElementId());
    if (!el) return;
    const videoElement = el.querySelector("video");
    if (!videoElement) return;
    videoElement.removeAttribute("src");
    videoElement.load();
  }

  onPlayerConfig(player: Player, config: PlayerConfig): PlayerConfig {
    const enabled: boolean = this.isEnabled();
    const embedded: boolean = this.isEmbeddedPlayer();

    if (enabled && !embedded && this.getMode() === AutoPlayMode.STOP) {
      this._stopPlayer(player);
    }

    return config;
  }

  onPlayerData(player: Player, data: PlayerData): PlayerData {
    const enabled: boolean = this.isEnabled();
    const embedded: boolean = this.isEmbeddedPlayer();

    if (enabled && !embedded) {
      const mode: AutoPlayMode = this.getMode();
      switch (mode) {
        case AutoPlayMode.STOP:
          this._stopping[player.getId()] = true;
          break;
      }
    }

    return data;
  }
  
  onPlayerCreated(player: Player): void {
    const id: string = player.getId();
    player.addOnDisposeCallback(() => {
      delete this._stopping[id];
      delete this._unstarted[id];
    });
    this.getHandler()
      .listen(player, EventType.VIDEO_DATA_CHANGE, (e: VideoDataChangeEvent) => {
        if (this._stopping[id] && e.dataType === "dataupdated") {
          logger.debug("Preveting auto-play by stopping player.");
          player.stop();
          this._stopping[id] = false;
        }
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
  }

  private onPlayed(player: Player) {
    const id = player.getId();

    const enabled: boolean = this.isEnabled();
    const embedded: boolean = this.isEmbeddedPlayer();

    if (enabled && this._unstarted[id] && !embedded) {
      const mode: AutoPlayMode = this.getMode();
      switch (mode) {
        case AutoPlayMode.STOP:
          break;
        case AutoPlayMode.PAUSE:
        default:
          logger.debug("Preveting auto-play by pausing the video.");
          player.pause();
          break;
      }
    }
    this._unstarted[id] = false;
  }
}