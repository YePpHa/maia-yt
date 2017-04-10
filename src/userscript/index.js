import * as storage from '../core/storage';
import Storage from 'goog/storage/storage';
import GreaseMonkeyMechanism from './storage/mechanism/greasemonkeymechanism';

import math from 'goog/math/math';
import Box from 'goog/math/box';

// Set the storage method.
storage.setInstance(new Storage(new GreaseMonkeyMechanism()));

var outerBox = new Box(0, 100, 100, 0);
console.log(outerBox);

console.log(math.sum(1, 2));
