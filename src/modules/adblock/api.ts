import { ModuleApi } from "../ModuleApi";

export class Api extends ModuleApi {
  constructor() {
    super("Adblock");
  }

  setEnabled(enabled: boolean): void {
    this._storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this._storage.get('enabled', false);
  }

  isVideoBlacklisted(videoId: string): boolean {
    const blacklist: string[] = this._storage.get('videoBlacklist', []);

    return blacklist.indexOf(videoId) !== -1;
  }

  isVideoWhitelisted(videoId: string): boolean {
    const whitelist: string[] = this._storage.get('videoWhitelist', []);

    return whitelist.indexOf(videoId) !== -1;
  }
  
  isChannelBlacklisted(channelId: string): boolean {
    const blacklist: string[] = this._storage.get('channelBlacklist', []);
    
    return blacklist.indexOf(channelId) !== -1;
  }
  
  isChannelWhitelisted(channelId: string): boolean {
    const whitelist: string[] = this._storage.get('channelWhitelist', []);
    
    return whitelist.indexOf(channelId) !== -1;
  }

  setSubscribedChannelsWhitelisted(whitelisted: boolean): void {
    this._storage.set('subscribedChannelsWhitelisted', whitelisted);
  }

  isSubscribedChannelsWhitelisted(): boolean {
    return this._storage.get('subscribedChannelsWhitelisted', false);
  }
}