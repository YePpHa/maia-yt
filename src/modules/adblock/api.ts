import { ISettingsStorage } from "../../settings/ISettingsStorage";

export class Api {
  constructor(private storage: ISettingsStorage) {}

  setEnabled(enabled: boolean): void {
    this.storage.set('enabled', enabled);
  }

  isEnabled(): boolean {
    return this.storage.get('enabled', false);
  }

  isVideoBlacklisted(videoId: string): boolean {
    const blacklist: string[] = this.storage.get('videoBlacklist', []);

    return blacklist.indexOf(videoId) !== -1;
  }

  isVideoWhitelisted(videoId: string): boolean {
    const whitelist: string[] = this.storage.get('videoWhitelist', []);

    return whitelist.indexOf(videoId) !== -1;
  }
  
  isChannelBlacklisted(channelId: string): boolean {
    const blacklist: string[] = this.storage.get('channelBlacklist', []);
    
    return blacklist.indexOf(channelId) !== -1;
  }
  
  isChannelWhitelisted(channelId: string): boolean {
    const whitelist: string[] = this.storage.get('channelWhitelist', []);
    
    return whitelist.indexOf(channelId) !== -1;
  }

  setSubscribedChannelsWhitelisted(whitelisted: boolean): void {
    this.storage.set('subscribedChannelsWhitelisted', whitelisted);
  }

  isSubscribedChannelsWhitelisted(): boolean {
    return this.storage.get('subscribedChannelsWhitelisted', false);
  }
}