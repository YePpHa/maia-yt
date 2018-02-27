import { Event } from '../../events/Event';
import { EventType } from './EventType';

export class MessageEvent extends Event {
  constructor(
    public payload: Object,
    target?: Object
  ) {
    super(EventType.MESSAGE, target);
  }
}