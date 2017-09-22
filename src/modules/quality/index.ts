import { onPlayerConfig, onPlayerData, onSettingsReactRegister } from "../IModule";
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

export class QualityModule extends Module implements onPlayerData, onSettingsReactRegister {
  protected name: string = "Quality";
  private _api: Api;

  getApi(): Api {
    if (!this._api) {
      this._api = new Api(this.getStorage());
    }
    return this._api;
  }

  onPlayerData(player: Player, data: PlayerData): PlayerData {
    const api = this.getApi();
    if (!api.isEnabled()) return data;

    const quality = api.getQuality();

    data.vq = quality;

    if (!player.isReady()) return data;

    let availableLevels = player.getAvailableQualityLevels();
    let currentLevel = player.getPlaybackQuality();
    if (currentLevel === quality || availableLevels.length === 0) return data;

    if (availableLevels.indexOf(quality) !== -1) {
      player.setPlaybackQualityRange(quality, quality);
      logger.debug("Settings quality (%s) through API", quality);

      return data;
    }

    const bestQualityPreferred = api.isBetterQualityPreferred();
    const values = PlaybackQuality.getValues();

    const availableLevelIndexes = availableLevels.map(level => values.indexOf(level));
    const levelIndex = values.indexOf(quality);
    if (levelIndex === -1) {
      logger.warning("Quality (%s) can't be found in values.", quality);
      return data;
    }

    const findLowerQuality = (): PlaybackQuality|undefined => {
      for (let i = levelIndex - 1; i >= 0; i--) {
        if (availableLevelIndexes.indexOf(i) !== -1) {
          return values[i];
        }
      }

      return undefined;
    };

    const findBetterQuality = (): PlaybackQuality|undefined => {
      for (let i = levelIndex + 1; i < values.length; i++) {
        if (availableLevelIndexes.indexOf(i) !== -1) {
          return values[i];
        }
      }

      return undefined;
    };

    let nextQuality: PlaybackQuality|undefined;

    if (bestQualityPreferred) {
      nextQuality = findBetterQuality();
      if (!nextQuality) nextQuality = findLowerQuality();
    } else {
      nextQuality = findLowerQuality();
      if (!nextQuality) nextQuality = findBetterQuality();
    }

    if (nextQuality) {
      player.setPlaybackQualityRange(nextQuality, nextQuality);
      logger.debug("Changing quality to %s instead of %s due to it not being available.", nextQuality, quality);
    } else {
      logger.debug("Couldn't find a quality close to %s.", quality);
    }

    return data;
  }

  onSettingsReactRegister(): ISettingsReact {
    return new SettingsReact(this.getApi());
  }
}