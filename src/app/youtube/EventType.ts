export enum EventType {
  READY = 'ready',
  UNSTARTED = 'unstarted',
  ENDED = 'ended',
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  CUED = 'cued',
  PLAYBACK_QUALITY_CHANGE = 'playback-quality-change',
  PLAYBACK_RATE_CHANGE = 'playback-rate-change',
  API_CHANGE = 'api-change',
  ERROR = 'error'
};