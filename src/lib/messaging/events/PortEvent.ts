import { Event } from '../../events/Event';
import { ChannelPort } from '../ChannelPort';
import { InternalEventType } from './InternalEventType';

export class PortEvent extends Event {
  constructor(
    public port: ChannelPort,
    target?: Object
  ) {
    super(InternalEventType.CONNECT, target);
  }
}