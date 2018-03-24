export const polyfill = {
  /**
   * Returns the current time in milliseconds.
   */
  now: () => +new Date()
};

export const now = Date.now || polyfill.now;