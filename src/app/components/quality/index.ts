import { onPlayerData, onSettingsReactRegister, onPlayerCreated, onPlayerReady, onPlayerDispose, onPlayerBeforeCreated } from "../IComponent";
import { PlayerConfig, PlayerData } from "../../youtube/PlayerConfig";
import { Player } from "../../player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../youtube/EventType';
import { ISettingsReact } from "../../settings-storage/ISettings";
import { QualitySettings as SettingsReact } from './settings';
import { QualityApi } from "./api";
import { PlaybackQuality } from "../../youtube/PlayerApi";
import { injectable } from "inversify";
import { EventHandler } from "../../libs/events/EventHandler";
import { Disposable } from "../../libs/Disposable";
const logger = new Logger("QualityComponent");

@injectable()
export class QualityComponent implements onPlayerBeforeCreated, onPlayerCreated, onPlayerReady, onPlayerData, onPlayerDispose, onSettingsReactRegister {
  private _api: QualityApi;
  private _players: {[key: string]: PlayerQuality} = {};

  constructor(api: QualityApi) {
    this._api = api;
  }

  onPlayerBeforeCreated(player: Player): void {
    const id = player.getId();
    if (this._players.hasOwnProperty(id))
      throw new Error("Player already created in component");
    this._players[id] = new PlayerQuality(this._api, player);
  }

  onPlayerCreated(player: Player): void {
    const id = player.getId();
    if (!this._players.hasOwnProperty(id))
      throw new Error("Player not found in component");
    this._players[id].onCreated();
  }

  onPlayerDispose(player: Player): void {
    const id = player.getId();
    if (!this._players.hasOwnProperty(id))
      throw new Error("Player not found in component");
    this._players[id].dispose();
    
    delete this._players[id];
  }

  onPlayerReady(player: Player): void {
    const id = player.getId();
    if (!this._players.hasOwnProperty(id))
      throw new Error("Player not found in component");
    this._players[id].onReady();
  }
  
  onPlayerData(player: Player, data: PlayerData): PlayerData {
    const id = player.getId();
    if (!this._players.hasOwnProperty(id))
      throw new Error("Player not found in component");
    return this._players[id].onData(data);
  }

  onSettingsReactRegister(): ISettingsReact {
    return new SettingsReact(this._api);
  }
}

class PlayerQuality extends Disposable {
  private _player: Player;
  private _handler?: EventHandler;

  private _api: QualityApi;

  private _unstarted: boolean = false;

  constructor(api: QualityApi, player: Player) {
    super();

    this._api = api;
    this._player = player;
  }

  protected disposeInternal() {
    super.disposeInternal();

    if (this._handler) {
      this._handler.dispose();
      this._handler = undefined;
    }
  }

  private _updatePlaybackQuality(quality: PlaybackQuality, bestQualityPreferred: boolean): void {
    let availableLevels = this._player.getAvailableQualityLevels();
    let currentLevel = this._player.getPlaybackQuality();
    if (availableLevels.length === 0) {
      logger.debug("No quality levels are available.");
      return;
    }

    if (availableLevels.indexOf(quality) !== -1) {
      if (this._player.isEmbedded()) {
        this._player.setPlaybackQuality(quality);
      } else {
        this._player.setPlaybackQualityRange(quality, quality);
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
      if (this._player.isEmbedded()) {
        this._player.setPlaybackQuality(nextQuality);
      } else {
        this._player.setPlaybackQualityRange(nextQuality, nextQuality);
      }
      logger.debug("Changing quality to %s instead of %s due to it not being available.", nextQuality, quality);
    } else {
      logger.debug("Couldn't find a quality close to %s.", quality);
    }
  }

  getHandler(): EventHandler {
    if (!this._handler) {
      this._handler = new EventHandler(this);
    }
    return this._handler;
  }

  onCreated() {
    this.getHandler()
      .listen(this._player, EventType.Unstarted, () => {
        this._unstarted = true;
        this._updatePlaybackQuality(this._api.getQuality(), this._api.isBetterQualityPreferred());
      })
      .listen(this._player, EventType.ApiChange, () => {
        if (!this._unstarted) return;
        this._unstarted = false;
        this._updatePlaybackQuality(this._api.getQuality(), this._api.isBetterQualityPreferred());
      })
  }

  onReady() {
    if (!this._api.isEnabled()) return;

    const quality = this._api.getQuality();

    this._updatePlaybackQuality(quality, this._api.isBetterQualityPreferred());
  }

  onData(data: PlayerData): PlayerData {
    if (!this._api.isEnabled()) return data;

    const quality = this._api.getQuality();

    data.vq = quality;

    if (!this._player.isReady()) return data;

    this._updatePlaybackQuality(quality, this._api.isBetterQualityPreferred());

    return data;
  }
}