import { onPlayerConfig, onPlayerData, onSettingsReactRegister } from "../IModule";
import { PlayerConfig, PlayerData } from "../../app/youtube/PlayerConfig";
import { Module } from "../Module";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
import { ISettingsReact } from "../../settings/ISettings";
import { Settings as SettingsReact } from './settings';
const logger = new Logger("AdblockModule");

export class AdblockModule extends Module implements onPlayerData, onSettingsReactRegister {
  protected name: string = "Adblock";
  
  isEnabled(): boolean {
    return this.getStorage().get('enabled', false);
  }

  setEnabled(enabled: boolean): void {
    this.getStorage().set('enabled', enabled);
  }

  isVideoBlacklisted(videoId: string): boolean {
    const blacklist: string[] = this.getStorage().get('videoBlacklist', []);

    return blacklist.indexOf(videoId) !== -1;
  }

  isVideoWhitelisted(videoId: string): boolean {
    const whitelist: string[] = this.getStorage().get('videoWhitelist', []);

    return whitelist.indexOf(videoId) !== -1;
  }
  
  isChannelBlacklisted(channelId: string): boolean {
    const blacklist: string[] = this.getStorage().get('channelBlacklist', []);
    
    return blacklist.indexOf(channelId) !== -1;
  }
  
  isChannelWhitelisted(channelId: string): boolean {
    const whitelist: string[] = this.getStorage().get('channelWhitelist', []);
    
    return whitelist.indexOf(channelId) !== -1;
  }

  isSubscribedChannelsWhitelisted(): boolean {
    return this.getStorage().get('subscribedChannelsWhitelisted', false);
  }

  onPlayerData(player: Player, data: PlayerData): PlayerData {
    if (!this.isEnabled()) return data;

    const subscribed: boolean = data.subscribed === "1";

    const videoId = data.video_id;
    const channelId = data.ucid;

    // Don't block ads if channel is subscribed to and the subscribed channels
    // are whitelisted.
    let blockAds: boolean = !subscribed || !this.isSubscribedChannelsWhitelisted();
    
    // Don't block ads if video or channel is whitelisted.
    if (this.isVideoWhitelisted(videoId) || this.isChannelWhitelisted(channelId)) {
      blockAds = false;
    }

    // Block ads if video or channel is blacklisted.
    if (this.isVideoBlacklisted(videoId) || this.isChannelBlacklisted(channelId)) {
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
    return new SettingsReact(this.getStorage());
  }
}