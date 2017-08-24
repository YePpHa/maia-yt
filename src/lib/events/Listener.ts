import { Listenable, addImplementation } from './Listenable';
import { ListenableKey, reserveKey } from './ListenableKey';

export class Listener implements ListenableKey {
  public key: number;

  /**
   * Whether the listener has been removed.
   */
  public removed: boolean = false;
  
  /**
   * Whether to remove the listener after it has been called.
   */
  public callOnce: boolean = false;

  constructor(
    public listener: Function,
    public proxy: Function|undefined,
    public src: Listenable|EventTarget|undefined,
    public type: string,
    public capture: boolean,
    public handler?: any
  ) {
    this.key = reserveKey();
  }

  /**
   * Marks this listener as removed. This also remove references held by
   * this listener object (such as listener and event source).
   */
  markAsRemoved() {
    this.removed = true;
    this.proxy = undefined;
    this.handler = undefined;
  }
}

addImplementation(Listener);