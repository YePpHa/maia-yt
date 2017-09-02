import { onPlayerConfiguration } from "../IModule";
import { PlayerConfig } from "../../app/youtube/PlayerConfig";
import { Module } from "../Module";
import { Player } from "../../app/player/Player";
import { Logger } from '../../libs/logging/Logger';
import { EventType } from '../../app/youtube/EventType';
const logger = new Logger("AutoPlayModule");

export class AdblockModule extends Module implements onPlayerConfiguration {

  onPlayerConfiguration(player: Player, config: PlayerConfig): PlayerConfig {
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

    return config;
  }
}