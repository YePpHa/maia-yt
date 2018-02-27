import { Event } from '../../events/Event';
import { ChannelPort } from '../ChannelPort';
import { EventType } from './EventType';

export class PortEvent extends Event {
  constructor(
    public port: ChannelPort,
    target?: Object
  ) {
    super(EventType.CONNECT, target);
  }
}