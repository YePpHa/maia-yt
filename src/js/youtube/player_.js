import EventTarget from 'goog:goog.events.EventTarget';

export default class Player extends EventTarget {
  /**
   * The YouTube player with event bindings.
   * @param {?string} id the player element ID.
   */
  constructor(id) {
    super();

    /**
     * The player instance.
     * @private {?string}
     */
    this.id_ = id;

    channel.send("youtube.player#constructor", { 'id': id });
  }

  cueVideoById() {

  }

  loadVideoById() {

  }

  cueVideoByUrl() {

  }

  loadVideoByUrl() {

  }

  playVideo() {

  }

  pauseVideo() {

  }

  stopVideo() {

  }

  clearVideo() {

  }

  getVideoBytesLoaded() {

  }

  getVideoBytesTotal() {

  }

  getVideoLoadedFraction() {

  }

  getVideoStartBytes() {

  }

  cuePlaylist() {

  }

  loadPlaylist() {

  }

  nextVideo() {

  }

  previousVideo() {

  }

  playVideoAt() {

  }

  setShuffle() {

  }

  setLoop() {

  }

  getPlaylist() {

  }

  getPlaylistIndex() {

  }

  getPlaylistId() {

  }

  loadModule() {

  }

  unloadModule() {

  }

  setOption() {

  }

  getOption() {

  }

  getOptions() {

  }

  mute() {

  }

  unMute() {

  }

  isMuted() {

  }

  setVolume() {

  }

  getVolume() {

  }

  seekTo() {

  }

  getPlayerState() {

  }

  getPlaybackRate() {

  }

  setPlaybackRate() {

  }

  getAvailablePlaybackRates() {

  }

  getPlaybackQuality() {

  }

  setPlaybackQuality() {

  }

  getAvailableQualityLevels() {

  }

  getCurrentTime() {

  }

  getDuration() {

  }

  addEventListener() {

  }

  removeEventListener() {

  }

  getVideoUrl() {

  }

  getDebugText() {

  }

  getVideoEmbedCode() {

  }

  getVideoData() {

  }

  addCueRange() {

  }

  removeCueRange() {

  }

  setSize() {

  }

  getApiInterface() {

  }

  destroy() {

  }

  showVideoInfo() {

  }

  hideVideoInfo() {

  }

  getMediaReferenceTime() {

  }

  getPresentingPlayerType() {

  }

  addInfoCardXml() {

  }

  cueVideoByPlayerVars() {

  }

  loadVideoByPlayerVars() {

  }

  preloadVideoByPlayerVars() {

  }

  seekBy() {

  }

  updatePlaylist() {

  }

  updateLastActiveTime() {

  }

  updateVideoData() {

  }

  getPlayerResponse() {

  }

  getStoryboardFormat() {

  }

  getProgressState() {

  }

  getHousebrandProperties() {

  }

  setPlaybackQualityRange() {

  }

  getCurrentPlaylistSequence() {

  }

  canPlayType() {

  }

  sendVideoStatsEngageEvent() {

  }

  setCardsVisible() {

  }

  handleGlobalKeyDown() {

  }

  getAudioTrack() {

  }

  setAudioTrack() {

  }

  getAvailableAudioTracks() {

  }

  getMaxPlaybackQuality() {

  }

  setSizeStyle() {

  }

  forceFrescaUpdate() {

  }

  setAutonav() {

  }

  setAutonavState() {

  }

  showControls() {

  }

  hideControls() {

  }

  getVisibilityState() {

  }

  shouldSendVisibilityState() {

  }

  getVideoContentRect() {

  }

  setSafetyMode() {

  }

  setFauxFullscreen() {

  }

  cancelPlayback() {

  }

  getVideoStats() {

  }

  updateSubtitlesUserSettings() {

  }

  getSubtitlesUserSettings() {

  }

  resetSubtitlesUserSettings() {

  }

  isFastLoad() {

  }

  isPeggedToLive() {

  }

  setMinimized() {

  }

  getSphericalConfig() {

  }

  setSphericalConfig() {

  }

  setBlackout() {

  }

  onAdUxClicked() {

  }

  toggleSettingsMenu() {

  }

  getPlayerSize() {

  }

  setGlobalCrop() {

  }
}
