import IterableMechanism from 'goog:goog.storage.mechanism.IterableMechanism';
import ErrorCode from 'goog:goog.storage.mechanism.ErrorCode';
import iter from 'goog:goog.iter';
import asserts from 'goog:goog.asserts';

const STORAGE_AVAILABLE_KEY_ = '__sak';

export default class GreaseMonkeyMechanism extends IterableMechanism {
  constructor() {
    super();
  }

  /**
   * Determines whether or not the mechanism is available.
   *
   * @return {boolean} True if the mechanism is available.
   */
  isAvailable() {
    try {
      GM_setValue(STORAGE_AVAILABLE_KEY_, '1');
      GM_deleteValue(STORAGE_AVAILABLE_KEY_);
      return true;
    } catch (e) {
      return false;
    }
  }

  /** @override */
  set(key, value) {
    GM_setValue(key, value);
  }

  /** @override */
  get(key) {
    var value = GM_getValue(key);
    if (!goog.isString() && !goog.isNull(value)) {
      throw ErrorCode.INVALID_VALUE;
    }
    return value;
  }

  /** @override */
  remove(key) {
    GM_deleteValue(key);
  }

  /** @override */
  getCount() {
    return GM_listValues().length;
  }

  /** @override */
  __iterator__(opt_keys) {
    var i = 0;
    var newIter = new iter.Iterator();
    newIter.next = function() {
      var keys = GM_listValues();
      if (i >= keys.length) {
        throw iter.StopIteration;
      }
      var key = asserts.assertString(keys[i++]);
      if (opt_keys) {
        return key;
      }
      var value = GM_getValue(key);
      // The value must exist and be a string, otherwise it is a storage error.
      if (!goog.isString(value)) {
        throw ErrorCode.INVALID_VALUE;
      }
      return value;
    };
    return newIter;
  }

  clear() {
    var keys = GM_listValues();
    for (let i = 0, len = keys.length; i < len; i++) {
      GM_deleteValue(keys[i]);
    }
  }

  /**
   * Gets the key for a given key index. If an index outside of
   * [0..this.getCount()) is specified, this function returns null.
   * @param {number} index A key index.
   * @return {?string} A storage key, or null if the specified index is out of
   *     range.
   */
  key(index) {
    var keys = GM_listValues();
    if (index < 0 || index >= keys.length) {
      return null;
    }
    return keys[index];
  }
}
