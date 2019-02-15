import { onPlayerCreated, onPlayerData, onPlayerApiCall, onPlayerApiCallResponse, onPlayerDispose } from "../IModule";
import { PlayerData } from "../../youtube/PlayerConfig";
import { Player } from "../../player/Player";
import { Logger } from '../../libs/logging/Logger';
import { AutoPlayApi, AutoPlayMode } from "./api";
const logger = new Logger("AutoPlayModule");

export class AutoPlayModule implements onPlayerCreated, onPlayerData, onPlayerApiCall, onPlayerDispose {
  private _api: AutoPlayApi;

  // Ready variable to prevent loadVideoByPlayerVars from being called due to
  // the ytplayer.config.loaded being false.
  private _ready: {[key: string]: boolean} = {};

  constructor(api: AutoPlayApi) {
    this._api = api;
  }

  private _preventAutoPlay(player: Player): void {
    const api = this._api;
    const enabled: boolean = api.isEnabled();
    const detailPage: boolean = player.isDetailPage();

    if (detailPage) {
      if (enabled) {
        const mode: AutoPlayMode = api.getMode();
        if (mode === AutoPlayMode.Pause) {
          player.pause();
        }
      }
    } else if (player.isProfilePage()) {
      if (api.isChannelEnabled()) {
        const mode: AutoPlayMode = api.getChannelMode();
        if (mode === AutoPlayMode.Pause) {
          player.pause();
        }
      }
    }
  }

  onPlayerDispose(player: Player) {
    const id = player.getId();

    if (this._ready.hasOwnProperty(id)) {
      delete this._ready[id];
    }
  }

  onPlayerData(player: Player, data: PlayerData): PlayerData {
    const api = this._api;
    
    if (api.isEnabled() && player.isDetailPage()) {
      if (api.getMode() === AutoPlayMode.Stop) {
        data.autoplay = "0";
      }
    } else if (api.isChannelEnabled() && player.isProfilePage()) {
      if (api.getChannelMode() === AutoPlayMode.Stop) {
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
      const api = this._api;

      const detailPage = api.isEnabled() && player.isDetailPage() && api.getMode() === AutoPlayMode.Stop;
      const profilePage = api.isChannelEnabled() && player.isProfilePage() && api.getChannelMode() === AutoPlayMode.Stop;

      if (!detailPage && !profilePage)
        return;

      logger.debug("Cue video data instead of loading it immediately (loadVideoByPlayerVars -> cueVideoByPlayerVars).");

      try {
        return {
          value: player.cueVideoByPlayerVars(data)
        };
      } catch (e) {
        logger.error(e);
      }
    }
  }
  
  onPlayerCreated(player: Player): void {
    const api = this._api;
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
}