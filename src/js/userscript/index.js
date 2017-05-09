import GreaseMonkeyMechanism from './storage/mechanism/greasemonkeymechanism';
import Storage from 'goog:goog.storage.Storage';

import { App } from '../core/app';

var app = new App(new Storage(new GreaseMonkeyMechanism()));
// Attach listeners
app.enterDocument();

// Inject the code that will act as a proxy between the YouTube player and this.
app.inject();


/*var channel = new Channel("background");
channel.listen(EventType.CONNECT, function(e) {
  var port = new ServicePort(e.port);
  port.enterDocument();
  port.registerService("player#onStateChange", function(state) {
    console.log("State", state);
    if (state === 0) {
      port.call("player#play");
    } else {
      console.log(port.call("player#getCurrentTime"));
    }
  });
}, false);
channel.enterDocument();*/
