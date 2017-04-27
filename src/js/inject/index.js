import { ChannelPort, EventType } from '../messaging/channelport';

var port = new ChannelPort();
port.listen(EventType.MESSAGE, function(e) {
  console.log("INJECT", e.payload);
}, false);

console.log("Background");
port.connect("background");
