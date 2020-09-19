import { ListenableKey } from './ListenableKey';
import { Event, EventLike } from './Event';

export interface Listenable {
  listen(type: string, listener: Function, useCapture?: boolean, listenerScope?: Object): ListenableKey;
  listenOnce(type: string, listener: Function, useCapture?: boolean, listenerScope?: Object): ListenableKey;
  unlisten(type: string, listener: Function, useCapture?: boolean, listenerScope?: Object): boolean;
  unlistenByKey(key: ListenableKey): boolean;
  dispatchEvent(event: EventLike): boolean;

  /**
   * Removes all the listeners and returns the amount removed.
   */
  removeAllListeners(type?: string): number;

  getParentEventTarget(): Listenable|undefined;
  fireListeners(type: string, capture: boolean, event: Event): boolean;
  getListeners(type: string, capture: boolean): ListenableKey[];
  getListener(type: string, listener: Function, capture: boolean, listenerScope?: Object): ListenableKey|undefined;
  hasListener(type?: string, capture?: boolean): boolean;
}

const IMPLEMENTED_BY_PROP: string = '_listenable_' + ((Math.random() * 1e6) | 0);

export function addImplementation(cls: Function) {
  cls.prototype[IMPLEMENTED_BY_PROP] = true;
}

export function isImplementedBy(obj: any): boolean {
  return !!(obj && obj[IMPLEMENTED_BY_PROP]);
}