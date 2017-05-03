import * as storage from '../core/storage';
import GreaseMonkeyMechanism from './storage/mechanism/greasemonkeymechanism';

import Storage from 'goog:goog.storage.Storage';
import {injectJS} from '../core/script';

import { Channel, EventType } from '../messaging/channel';
import { ServicePort } from '../messaging/serviceport';

/**
 * The core that's injected into the unsafe window scope.
 * @define {!string}
 */
goog.define("CORE_INJECT_JS", "");

// Set the storage method.
storage.setInstance(new Storage(new GreaseMonkeyMechanism()));

var channel = new Channel("background");
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
channel.enterDocument();

injectJS(CORE_INJECT_JS);
