import { onPlayerConfig, onPlayerData, onSettingsReactRegister } from "../IModule";
import { PlayerConfig, PlayerData } from "../../app/youtube/PlayerConfig";
import { Module } from "../Module";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
import { ISettingsReact } from "../../settings/ISettings";
import { Settings as SettingsReact } from './settings';
import { Api } from "./api";
const logger = new Logger("AdblockModule");

export class AdblockModule extends Module implements onPlayerData, onSettingsReactRegister {
  protected name: string = "Adblock";
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

    const subscribed: boolean = data.subscribed === "1";

    const videoId = data.video_id;
    const channelId = data.ucid;

    // Don't block ads if channel is subscribed to and the subscribed channels
    // are whitelisted.
    let blockAds: boolean = !subscribed || !api.isSubscribedChannelsWhitelisted();
    
    // Don't block ads if video or channel is whitelisted.
    if (api.isVideoWhitelisted(videoId) || api.isChannelWhitelisted(channelId)) {
      blockAds = false;
    }

    // Block ads if video or channel is blacklisted.
    if (api.isVideoBlacklisted(videoId) || api.isChannelBlacklisted(channelId)) {
      blockAds = true;
    }

    if (blockAds) {
      logger.debug("Blocking ads on video (" + data.video_id + ")");

      // Delete the ad-related properties from the configuration.
      delete data.ad3_module;
      delete data.ad_device;
      delete data.ad_flags;
      delete data.ad_logging_flag;
      delete data.ad_preroll;
      delete data.ad_slots;
      delete data.ad_tag;
      delete data.adsense_video_doc_id;
      delete data.advideo;
      delete data.afv;
      delete data.afv_ad_tag;
      delete data.cafe_experiment_id;
      delete data.excluded_ads;
      delete data.midroll_freqcap;
      delete data.invideo;
      delete data.instream;
      delete data.pyv_ad_channel;
      delete data.encoded_ad_safety_reason;

      data.allow_html5_ads = "0";
    }

    return data;
  }

  onSettingsReactRegister(): ISettingsReact {
    return new SettingsReact(this.getApi());
  }
}