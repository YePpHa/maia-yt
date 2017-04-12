var instance = null;

/**
 * Set the storage instance.
 * @param {?goog.storage.Storage} storage the storage instance.
 */
export function setInstance(storage) {
  instance = storage;
}

/**
 * Returns the storage instance.
 * @return {?goog.storage.Storage} the storage instance.
 */
export function getInstance() {
  return instance;
}
