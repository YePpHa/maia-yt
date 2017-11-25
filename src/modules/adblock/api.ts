import { ModuleApi } from "../ModuleApi";

export class Api extends ModuleApi {
  constructor() {
    super("Adblock");
  }

  setEnabled(enabled: boolean): void {
    this.getStorage().set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.getStorage().get('enabled', false);
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

  setSubscribedChannelsWhitelisted(whitelisted: boolean): void {
    this.getStorage().set('subscribedChannelsWhitelisted', whitelisted);
  }

  isSubscribedChannelsWhitelisted(): boolean {
    return this.getStorage().get('subscribedChannelsWhitelisted', false);
  }
}