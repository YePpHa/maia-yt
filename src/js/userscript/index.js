import * as storage from '../core/storage';
import GreaseMonkeyMechanism from './storage/mechanism/greasemonkeymechanism';

import Storage from 'goog:goog.storage.Storage';
import {injectJS} from '../core/script';

import Player from '../youtube/player';

import { Channel, EventType } from '../messaging/channel';

/**
 * The core that's injected into the unsafe window scope.
 * @define {!string}
 */
goog.define("CORE_INJECT_JS", "");

// Set the storage method.
storage.setInstance(new Storage(new GreaseMonkeyMechanism()));

var channel = new Channel("background");
channel.listen(EventType.CONNECT, function(e) {
  var port = e.port;

  console.log("Connected", port);

  console.log("Sending...");
  port.send("This is my message to people.");
}, false);
channel.enterDocument();

console.log("Injecting...");
injectJS(CORE_INJECT_JS);
