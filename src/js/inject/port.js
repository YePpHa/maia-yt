import { ChannelPort, EventType } from '../messaging/channelport';
import { ServicePort } from '../messaging/serviceport';

var port = new ChannelPort();
port.connect("background");

export var servicePort = new ServicePort(port);
servicePort.enterDocument();
