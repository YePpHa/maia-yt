import * as storage from '../core/storage';
import GreaseStorage from './storage/greasestorage';

import math from 'goog/math/math';
import Box from 'goog/math/box';

// Set the storage method.
storage.setInstance(new GreaseStorage());

var outerBox = new Box(0, 100, 100, 0);
console.log(outerBox);

console.log(math.sum(1, 2));
