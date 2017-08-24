import { EventTarget } from './EventTarget';

export interface ListenableKey {
  /**
   * The source event target.
   */
  src: Object|EventTarget|undefined;

  /**
   * The event type the listener is listening to.
   */
  type: string;

  /**
   * The listener function.
   */
  listener: Function;

  /**
   * Whether the listener works on capture phase.
   */
  capture: boolean;

  /**
   * The 'this' object for the listener function's scope.
   */
  handler?: Object;

  /**
   * A globally unique number to identify the key.
   */
  key: number;

  /**
   * Wrapper for the listener that patches the event.
   */
  proxy: Function|undefined;
}

var _counter: number = 0;
export function reserveKey() {
  return ++_counter;
}