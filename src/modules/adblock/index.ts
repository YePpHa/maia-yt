import { onPlayerConfiguration } from "../IModule";
import { PlayerConfig } from "../../app/youtube/PlayerConfig";
import { Module } from "../Module";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
const logger = new Logger("AdblockModule");

export class AdblockModule extends Module implements onPlayerConfiguration {
  public name: string = "Adblock";
  
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

  onPlayerConfiguration(player: Player, config: PlayerConfig): PlayerConfig {
    if (!this.isEnabled()) return config;

    const subscribed: boolean = config.args.subscribed === "1";

    const videoId = config.args.video_id;
    const channelId = config.args.ucid;

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
      // Delete the ad-related properties from the configuration.
      delete config.args.ad3_module;
      delete config.args.ad_device;
      delete config.args.ad_flags;
      delete config.args.ad_logging_flag;
      delete config.args.ad_preroll;
      delete config.args.ad_slots;
      delete config.args.ad_tag;
      delete config.args.adsense_video_doc_id;
      delete config.args.advideo;
      delete config.args.afv;
      delete config.args.afv_ad_tag;

      config.args.allow_html5_ads = "0";
    }

    return config;
  }
}