import * as storage from '../core/storage';
import GreaseMonkeyMechanism from './storage/mechanism/greasemonkeymechanism';

import Storage from 'goog:goog.storage.Storage';

/**
 * The core that's injected into the unsafe window scope.
 * @define {!string}
 */
goog.define("CORE_INJECT_JS", "");

// Set the storage method.
storage.setInstance(new Storage(new GreaseMonkeyMechanism()));

console.log(CORE_INJECT_JS);
