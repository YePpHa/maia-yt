import { PlayerConfigArguments } from './PlayerConfig';

export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}

export enum PlaybackQuality {
  AUTO = 'auto',
  TINY = 'tiny',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  HD720 = 'hd720',
  HD1080 = 'hd1080',
  HD1440 = 'hd1440',
  HD2160 = 'hd2160',
  HIGHRES = 'highres'
}

export declare interface PlayerApi {
  cueVideoById: {
    (videoId: string, startSeconds?: number, suggestedQuality?: PlaybackQuality): void;
    (options: {
      videoId: string,
      startSeconds?: number,
      endSeconds?: number,
      suggestedQuality?: PlaybackQuality
    }): void;
  };

  loadVideoById: {
    (videoId: string, startSeconds?: number, suggestedQuality?: PlaybackQuality): void;
    (options: {
      videoId: string,
      startSeconds?: number,
      endSeconds?: number,
      suggestedQuality?: PlaybackQuality
    }): void;
  };
  cueVideoByUrl: {
    (mediaContentUrl: string, startSeconds?: number, suggestedQuality?: PlaybackQuality): void;
    (options: {
      mediaContentUrl: string,
      startSeconds?: number,
      endSeconds?: number,
      suggestedQuality?: PlaybackQuality
    }): void;
  };
  loadVideoByUrl: {
    (mediaContentUrl: string, startSeconds?: number, suggestedQuality?: PlaybackQuality): void;
    (options: {
      mediaContentUrl: string,
      startSeconds?: number,
      endSeconds?: number,
      suggestedQuality?: PlaybackQuality
    }): void;
  };
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  clearVideo: () => void;
  /** @deprecated */
  getVideoBytesLoaded: () => number;
  /** @deprecated */
  getVideoBytesTotal: () => number;
  getVideoLoadedFraction: () => number;
  /** @deprecated */
  getVideoStartBytes: () => number;
  cuePlaylist: {
    (playlist: string|string[], index?: number, startSeconds?: number, suggestedQuality?: PlaybackQuality): void;
    (options: {
      listType?: 'playlist'|'search'|'user_uploads',
      list: string,
      index?: number,
      startSeconds?: number,
      suggestedQuality?: PlaybackQuality
    }): void;
  };
  loadPlaylist: {
    (playlist: string|string[], index?: number, startSeconds?: number, suggestedQuality?: PlaybackQuality): void;
    (options: {
      listType?: 'playlist'|'search'|'user_uploads',
      list: string,
      index?: number,
      startSeconds?: number,
      suggestedQuality?: PlaybackQuality
    }): void;
  };
  nextVideo: () => void;
  previousVideo: () => void;
  playVideoAt: (time: number) => void;
  setShuffle: (shuffle: boolean) => void;
  setLoop: (loop: boolean) => void;
  getPlaylist: () => string[];
  getPlaylistIndex: () => number;
  getPlaylistId: Function;
  loadModule: Function;
  unloadModule: Function;
  setOption: Function;
  getOption: Function;
  getOptions: Function;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  seekTo: (time: number, allowSeekAhead?: boolean) => void;
  getPlayerState: () => PlayerState;
  getPlaybackRate: () => number;
  setPlaybackRate: (rate: number) => void;
  getAvailablePlaybackRates: () => number[];
  getPlaybackQuality: () => PlaybackQuality;
  setPlaybackQuality: (quality: PlaybackQuality) => void;
  getAvailableQualityLevels: () => PlaybackQuality[];
  getCurrentTime: () => number;
  getDuration: () => number;
  addEventListener: (type: string, fn: Function|string) => void;
  removeEventListener: (type: string, fn: Function|string) => void;
  getVideoUrl: () => string;
  getDebugText: () => string;
  getVideoEmbedCode: () => string;
  getVideoData: () => any;
  addCueRange: (id: string, start: number, end: number) => boolean;
  removeCueRange: (id: string) => boolean;
  setSize: (width: number, height: number) => void;
  getApiInterface: () => PlayerApi;
  destroy: () => void;
  showVideoInfo: () => void;
  hideVideoInfo: () => void;
  getMediaReferenceTime: () => number;
  getPresentingPlayerType: () => number;
  addInfoCardXml: Function;
  cueVideoByPlayerVars: Function;
  loadVideoByPlayerVars: (playerVars: PlayerConfigArguments) => void;
  preloadVideoByPlayerVars: Function;
  seekBy: (seconds: number) => void;
  updatePlaylist: Function;
  updateLastActiveTime: Function;
  updateVideoData: Function;
  getPlayerResponse: Function;
  getStoryboardFormat: () => string;
  getProgressState: Function;
  getHousebrandProperties: Function;
  setPlaybackQualityRange: Function;
  getCurrentPlaylistSequence: Function;
  canPlayType: (mediaType: string) => boolean;
  sendVideoStatsEngageEvent: Function;
  setCardsVisible: Function;
  handleGlobalKeyDown: Function;
  getAudioTrack: Function;
  setAudioTrack: Function;
  getAvailableAudioTracks: Function;
  getMaxPlaybackQuality: () => PlaybackQuality;
  setSizeStyle: Function;
  forceFrescaUpdate: Function;
  setAutonav: Function;
  setAutonavState: Function;
  showControls: Function;
  hideControls: Function;
  getVisibilityState: () => number;
  shouldSendVisibilityState: Function;
  getVideoContentRect: () => { left: number, top: number, width: number, height: number };
  setSafetyMode: Function;
  setFauxFullscreen: (fauxFullscreen: boolean) => void;
  cancelPlayback: () => void;
  getVideoStats: Function;
  updateSubtitlesUserSettings: Function;
  getSubtitlesUserSettings: Function;
  resetSubtitlesUserSettings: Function;
  isFastLoad: () => boolean;
  isPeggedToLive: () => boolean;
  setMinimized: (minimized: boolean) => void;
  getSphericalConfig: Function;
  setSphericalConfig: Function;
  setBlackout: Function;
  onAdUxClicked: Function;
  getPlayerSize: () => { width: number, height: number };
  setGlobalCrop: Function;
  wakeUpControls: Function;
  isMutedByMutedAutoplay: () => boolean;
}