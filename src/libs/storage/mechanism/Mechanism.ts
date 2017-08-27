export interface Mechanism {
  /**
   * Set a value for a key.
   * @param key The key to set.
   * @param value The string to save.
   */
  set(key: string, value: string): void;

  /**
   * Returns the value stored under a key.
   * @param key The key to get.
   */
  get(key: string): string;

  /**
   * Remove a key and its value.
   * @param key The key to remove.
   */
  remove(key: string): void;
}