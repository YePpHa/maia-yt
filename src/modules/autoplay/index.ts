import { onPlayerConfiguration, onPlayerCreated } from "../IModule";
import { PlayerConfig } from "../../app/youtube/PlayerConfig";
import { Module } from "../Module";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
const logger = new Logger("AutoPlayModule");

export enum AutoPlayMode {
  PAUSE,
  STOP,
  EMBEDDED
}

export class AutoPlayModule extends Module implements onPlayerCreated, onPlayerConfiguration {
  public name: string = "AutoPlay";

  private _unstarted: boolean = true;

  isEnabled(): boolean {
    return this.getStorage().get('enabled', false);
  }

  getMode(): AutoPlayMode {
    return this.getStorage().get('mode', AutoPlayMode.PAUSE);
  }

  onPlayerConfiguration(player: Player, config: PlayerConfig): PlayerConfig {
    const enabled: boolean = this.isEnabled();
    if (enabled) {
      const mode: AutoPlayMode = this.getMode();
      switch (mode) {
        case AutoPlayMode.EMBEDDED:
          logger.debug("Preveting auto-play by changing player type to embedded type.");
          config.args.iv_load_policy = "3";
          break;
      }
    }

    return config;
  }
  
  onPlayerCreated(player: Player): void {
    this.getHandler()
      .listen(player, EventType.ENDED, () => {
        this._unstarted = false;
      })
      .listen(player, EventType.PAUSED, () => {
        this._unstarted = false;
      })
      .listen(player, EventType.AD_ENDED, () => {
        this._unstarted = false;
      })
      .listen(player, EventType.AD_PAUSED, () => {
        this._unstarted = false;
      })
      .listen(player, EventType.UNSTARTED, () => {
        this._unstarted = true;
      })
      .listen(player, EventType.AD_UNSTARTED, () => {
        this._unstarted = true;
      })
      .listen(player, EventType.PLAYED, () => this.onPlayed(player))
      .listen(player, EventType.AD_PLAYED, () => this.onPlayed(player));
  }

  private onPlayed(player: Player) {
    const enabled: boolean = this.isEnabled();

    if (enabled && this._unstarted) {
      logger.debug("Preveting auto-play by pausing the video.");

      const mode: AutoPlayMode = this.getMode();
      switch (mode) {
        case AutoPlayMode.EMBEDDED:
          break;
        case AutoPlayMode.STOP:
          player.stop();
          break;
        case AutoPlayMode.PAUSE:
        default:
          player.pause();
          break;
      }
    }
    this._unstarted = false;
  }
}