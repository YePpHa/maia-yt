import { Event } from '../../libs/events/Event';
import { EventType } from './EventType';
import { PlaybackQuality } from './PlayerApi';

export class QualityChangeEvent extends Event {
  constructor(public quality: PlaybackQuality, target?: Object) {
    super(EventType.QUALITY_CHANGE, target);
  }
}

export class RateChangeEvent extends Event {
  constructor(public rate: number, target?: Object) {
    super(EventType.RATE_CHANGE, target);
  }
}

export class SizeChangeEvent extends Event {
  constructor(public large: boolean, target?: Object) {
    super(EventType.SIZE_CHANGE, target);
  }
}

export class VolumeChangeEvent extends Event {
  constructor(public volume: number, public muted: boolean, target?: Object) {
    super(EventType.VOLUME_CHANGE, target);
  }
}

export class CueRangeEvent extends Event {
  constructor(public rangeId: string, type: string, target?: Object) {
    super(type, target);
  }
}

export class VideoDataChangeEvent extends Event {
  constructor(public dataType: string, public playerType: number, target?: Object) {
    super(EventType.VIDEO_DATA_CHANGE, target);
  }
}