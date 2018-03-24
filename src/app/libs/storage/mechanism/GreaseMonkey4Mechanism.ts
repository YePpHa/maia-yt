import { Mechanism } from './Mechanism';
import { ErrorCode } from '../ErrorCode';

const STORAGE_AVAILABLE_KEY_ = '__sak';

export class GreaseMonkey4Mechanism implements Mechanism {
  /**
   * Determines whether or not the mechanism is available.
   */
  async isAvailable(): Promise<boolean> {
    try {
      await GM.setValue(STORAGE_AVAILABLE_KEY_, '1');
      await GM.deleteValue(STORAGE_AVAILABLE_KEY_);
      return true;
    } catch (e) {
      return false;
    }
  }

  /** @override */
  async set(key: string, value: string) {
    await GM.setValue(key, value);
  }

  /** @override */
  async get(key: string): Promise<string> {
    let value: string = await GM.getValue(key);
    if (typeof value !== "string" && value !== null) {
      throw ErrorCode.InvalidValue;
    }
    return value;
  }

  /** @override */
  async remove(key: string): Promise<void> {
    await GM.deleteValue(key);
  }
}

declare namespace GM {
  /**
   * Deletes an existing name / value pair from the script storage.
   * @param  name  a name of the pair to delete.
   * @see    {@link http://wiki.greasespot.net/GM_deleteValue}
   */
  function deleteValue(name: string): Promise<void>;

  /**
   * Retrieves a value from the script storage.
   * @param    name          a name to retrieve.
   * @param    defaultValue  a value to be returned when the name does not exist.
   * @returns  a retrieved value, or passed default value, or undefined.
   * @see      {@link http://wiki.greasespot.net/GM_getValue}
   */
  function getValue(name: string, defaultValue?: any): Promise<any>;
  function getValue(name: string, defaultValue?: string): Promise<string>;
  function getValue(name: string, defaultValue?: number): Promise<number>;
  function getValue(name: string, defaultValue?: boolean): Promise<boolean>;

  /**
   * Retrieves an array of names stored in the script storage.
   * @returns  an array of names in the storage.
   * @see      {@link http://wiki.greasespot.net/GM_listValues}
   */
  function listValues(): Promise<string[]>;

  /**
   * Stores a name / value pair to the script storage.
   * @param  name   a name of the pair.
   * @param  value  a value to be stored.
   * @see    {@link http://wiki.greasespot.net/GM_setValue}
   */
  function setValue(name: string, value: string): Promise<void>;
  function setValue(name: string, value: boolean): Promise<void>;
  function setValue(name: string, value: number): Promise<void>;
}