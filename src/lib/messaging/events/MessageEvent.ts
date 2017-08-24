import { Event } from '../../events/Event';
import { InternalEventType } from './InternalEventType';

export class MessageEvent extends Event {
  constructor(
    public payload: Object,
    target?: Object
  ) {
    super(InternalEventType.MESSAGE, target);
  }
}