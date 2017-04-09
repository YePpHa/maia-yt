import Storage from '../../core/storage/storage';
import {serialize, deserialize} from '../../core/json';

export default class GreaseStorage extends Storage {
  constructor() {
    super();
  }

  /**
   * Returns all keys.
   * @return {?Array<string>} all keys.
   */
  keys() {
    return GM_listValues();
  }

  key(index) {
    return this.keys()[index];
  }

  getItem(key) {
    return deserialize(GM_getValue(key));
  }

  setItem(key, value) {
    GM_setValue(key, serialize(value));
  }

  removeItem(key) {
    GM_deleteValue(key);
  }

  clear() {
    var keys = this.keys();
    for (let i = 0, len = keys.length; i < len; i++) {
      this.removeItem(keys[i]);
    }
  }

  get length() {
    return GM_listValues().length;
  }
}
