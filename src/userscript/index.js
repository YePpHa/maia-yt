import * as storage from '../core/storage';
import GreaseMonkeyMechanism from './storage/mechanism/greasemonkeymechanism';

import Storage from 'goog:goog.storage.Storage';
import math from 'goog:goog.math';
import Box from 'goog:goog.math.Box';

// Set the storage method.
storage.setInstance(new Storage(new GreaseMonkeyMechanism()));

var outerBox = new Box(0, 100, 100, 0);
console.log(outerBox);

console.log(math.sum(1, 2));
