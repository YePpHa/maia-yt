import { onPlayerData, onSettingsReactRegister, onPlayerCreated, onPlayerReady } from "../IComponent";
import { PlayerConfig, PlayerData } from "../../youtube/PlayerConfig";
import { Component } from "../Component";
import { Player } from "../../player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../youtube/EventType';
import { ISettingsReact } from "../../settings/ISettings";
import { Settings as SettingsReact } from './settings';
import { Api } from "./api";
import { PlaybackQuality } from "../../youtube/PlayerApi";
import { injectable } from "inversify";
const logger = new Logger("QualityComponent");

@injectable()
export class QualityComponent extends Component implements onPlayerCreated, onPlayerReady, onPlayerData, onSettingsReactRegister {
  private _api: Api;

  getApi(): Api {
    if (!this._api) {
      this._api = new Api()
    }
    return this._api;
  }

  onPlayerCreated(player: Player): void {
    const api = this.getApi();
    let unstarted = false;
    this.getHandler()
      .listen(player, EventType.UNSTARTED, () => {
        unstarted = true;
        this.updatePlaybackQuality(player, api.getQuality(), api.isBetterQualityPreferred());
      })
      .listen(player, EventType.API_CHANGE, () => {
        if (!unstarted) return;
        unstarted = false;
        this.updatePlaybackQuality(player, api.getQuality(), api.isBetterQualityPreferred());
      })
  }

  onPlayerReady(player: Player): void {
    const api = this.getApi();
    if (!api.isEnabled()) return;

    const quality = api.getQuality();

    this.updatePlaybackQuality(player, quality, api.isBetterQualityPreferred());
  }
  
  onPlayerData(player: Player, data: PlayerData): PlayerData {
    const api = this.getApi();
    if (!api.isEnabled()) return data;

    const quality = api.getQuality();

    data.vq = quality;

    if (!player.isReady()) return data;

    this.updatePlaybackQuality(player, quality, api.isBetterQualityPreferred());

    return data;
  }

  private updatePlaybackQuality(player: Player, quality: PlaybackQuality, bestQualityPreferred: boolean): void {
    let availableLevels = player.getAvailableQualityLevels();
    let currentLevel = player.getPlaybackQuality();
    if (availableLevels.length === 0) {
      logger.debug("No quality levels are available.");
      return;
    }

    if (availableLevels.indexOf(quality) !== -1) {
      if (player.isEmbedded()) {
        player.setPlaybackQuality(quality);
      } else {
        player.setPlaybackQualityRange(quality, quality);
      }
      logger.debug("Settings quality (%s) through API", quality);

      return;
    }

    const values = PlaybackQuality.getValues();

    const availableLevelIndexes = availableLevels.map(level => values.indexOf(level));
    const levelIndex = values.indexOf(quality);
    if (levelIndex === -1) {
      logger.warning("Quality (%s) can't be found in values.", quality);
      return;
    }

    const findLowerQuality = (): PlaybackQuality|undefined => {
      for (let i = levelIndex - 1; i >= 0; i--) {
        if (availableLevelIndexes.indexOf(i) !== -1) {
          return values[i];
        }
      }

      return;
    };

    const findBetterQuality = (): PlaybackQuality|undefined => {
      for (let i = levelIndex + 1; i < values.length; i++) {
        if (availableLevelIndexes.indexOf(i) !== -1) {
          return values[i];
        }
      }

      return;
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
      if (player.isEmbedded()) {
        player.setPlaybackQuality(nextQuality);
      } else {
        player.setPlaybackQualityRange(nextQuality, nextQuality);
      }
      logger.debug("Changing quality to %s instead of %s due to it not being available.", nextQuality, quality);
    } else {
      logger.debug("Couldn't find a quality close to %s.", quality);
    }
  }

  onSettingsReactRegister(): ISettingsReact {
    return new SettingsReact(this.getApi());
  }
}