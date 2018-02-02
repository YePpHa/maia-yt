import { onPlayerData, onSettingsReactRegister, onPlayerCreated, onPlayerReady } from "../IModule";
import { PlayerConfig, PlayerData } from "../../app/youtube/PlayerConfig";
import { Module } from "../Module";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
import { ISettingsReact } from "../../settings/ISettings";
import { Settings as SettingsReact } from './settings';
import { Api } from "./api";
import { PlaybackQuality } from "../../app/youtube/PlayerApi";
const logger = new Logger("QualityModule");

export class QualityModule extends Module implements onPlayerCreated, onPlayerReady, onPlayerData, onSettingsReactRegister {
  private _api: Api;

  getApi(): Api {
    if (!this._api) {
      this._api = new Api()
    }
    return this._api;
  }

  onPlayerReady(player: Player): void {
    const api = this.getApi();
    if (!api.isEnabled()) return;

    const volume = api.getVolume();
    const muted = api.isMuted();

    player.setVolume(volume);
    if (muted) {
      player.mute();
    } else {
      player.unmute();
    }
  }

  onSettingsReactRegister(): ISettingsReact {
    return new SettingsReact(this.getApi());
  }
}