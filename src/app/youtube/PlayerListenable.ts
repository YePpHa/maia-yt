import { Event } from '../libs/events/Event';
import { Disposable } from '../libs/Disposable';
import { ListenerMap } from '../libs/events/ListenerMap';
import { Listenable, addImplementation } from '../libs/events/Listenable';
import { ListenableKey } from '../libs/events/ListenableKey';
import { PlayerApi } from './PlayerApi';
import { getObjectByName } from '../libs/property';

export class PlayerEvent extends Event {
  /**
   * @param detail the player event detail.
   * @param type the event type.
   * @param target optional target.
   */
  constructor(public detail: any, type: string, target?: Object) {
    super(type, target);
  }
}

/**
 * @implements {goog.events.Listenable}
 */
export class PlayerListenable extends Disposable implements Listenable {
  private _listeners: ListenerMap = new ListenerMap(this);
  private _proxy: {[key: number]: [string, Function]} = {};

  private _ytListeners: {[key: string]: {[key: string]: Function}} = {};
  private _ytTypesAllowed: {[key: string]: boolean} = {};

  /**
   * @param api the player API.
   */
  constructor(
    private api: PlayerApi
  ) {
    super();
  }

  protected disposeInternal() {
    super.disposeInternal();

    for (let type in this._ytListeners) {
      if (!this._ytListeners.hasOwnProperty(type)) continue;
      let listeners = this._ytListeners[type];
      for (let key in listeners) {
        if (!listeners.hasOwnProperty(key)) continue;

        this.api.removeEventListener(type, listeners[key]);
        this.api.addEventListener(type, key);
      }
    }

    this.removeAllListeners();
  }
  
  ytAddEventListener(type: string, fnOrName: Function|string) {
    let method: Function;
    if (typeof fnOrName === "string") {
      method = (...args: any[]) => {
        if (!this.isDisposed() && this._listeners.listeners[type]
          && this._listeners.listeners[type].length > 0
          && !this._ytTypesAllowed[type])
          return;

        let fn = getObjectByName(fnOrName) as Function;

        fn.apply(window, args);
      };
      if (!this._ytListeners[type]) this._ytListeners[type] = {};
      this._ytListeners[type][fnOrName] = method;
    } else {
      method = fnOrName;
    }
    this.api.addEventListener(type, method);
  }
  
  ytRemoveEventListener(type: string, fnOrName: Function|string) {
    let method: Function;
    if (typeof fnOrName === "string") {
      if (!this._ytListeners[type]) return;

      method = this._ytListeners[type][fnOrName];
      delete this._ytListeners[type][fnOrName];
      if (!method) return;
    } else {
      method = fnOrName;
    }
    this.api.removeEventListener(type, method);
  }

  listen(type: string, listener: Function, useCapture?: boolean | undefined, listenerScope?: Object | undefined): ListenableKey {
    let key = this._listeners.add(type, listener, false /* callOnce */,
      useCapture, listenerScope);
    let proxy: [string, Function] = [
      key.type,
      (detail: any, ...args: any[]) => {
        let evt = new PlayerEvent(detail, key.type, key.src);
        let returnValue = key.listener.call(key.handler, evt);

        if (!evt.defaultPrevented && this._ytListeners[key.type]) {
          this._ytTypesAllowed[key.type] = true;
          for (let name in this._ytListeners[key.type]) {
            this._ytListeners[key.type][name](detail, ...args);
          }
          this._ytTypesAllowed[key.type] = false;
        }
      }
    ];
    this._proxy[key.key] = proxy;
    this.api.addEventListener(proxy[0], proxy[1]);

    return key;
  }

  listenOnce(type: string, listener: Function, useCapture?: boolean | undefined, listenerScope?: Object | undefined): ListenableKey {
    let key = this._listeners.add(type, listener, true /* callOnce */,
      useCapture, listenerScope);
    let proxy: [string, Function] = [
      key.type,
      (detail: any, ...args: any[]) => {
        let evt = new PlayerEvent(detail, key.type, key.src);
        let returnValue = key.listener.call(key.handler, evt);

        if (!evt.defaultPrevented && this._ytListeners[key.type]) {
          this._ytTypesAllowed[key.type] = true;
          for (let name in this._ytListeners[key.type]) {
            this._ytListeners[key.type][name](detail, ...args);
          }
          this._ytTypesAllowed[key.type] = false;
        }
      }
    ];
    this._proxy[key.key] = proxy;
    this.api.addEventListener(proxy[0], proxy[1]);

    return key;
  }

  unlisten(type: string, listener: Function, useCapture?: boolean | undefined, listenerScope?: Object | undefined): boolean {
    const key = this.getListener(type, listener, !!useCapture, listenerScope);
    if (!key) return false;

    return this.unlistenByKey(key);
  }

  unlistenByKey(key: ListenableKey): boolean {
    const proxy = this._proxy[key.key];
    delete this._proxy[key.key];

    this.api.removeEventListener(proxy[0], proxy[1]);

    return this._listeners.removeByKey(key);
  }

  dispatchEvent(event: string | Object | Event): boolean {
    throw new Error("Method not implemented.");
  }

  removeAllListeners(type?: string | undefined): number {
    if (!this._listeners) {
      return 0;
    }

    for (let type in this._listeners.listeners) {
      if (this._listeners.listeners.hasOwnProperty(type)) {
        let listeners = this._listeners.listeners[type];
        for (let i = 0; i < listeners.length; i++) {
          let key = listeners[i];
          if (type && key.type !== type) continue;

          let proxy = this._proxy[key.key];
          delete this._proxy[key.key];

          this.api.removeEventListener(proxy[0], proxy[1]);
        }
      }
    }

    return this._listeners.removeAll(type);
  }

  getParentEventTarget(): Listenable|undefined {
    return undefined;
  }

  fireListeners(type: string, capture: boolean, event: Event): boolean {
    throw new Error("Method not implemented.");
  }

  getListeners(type: string, capture: boolean): ListenableKey[] {
    return this._listeners.getListeners(type, capture);
  }

  getListener(type: string, listener: Function, capture: boolean, listenerScope?: Object | undefined): ListenableKey | undefined {
    return this._listeners.getListener(type, listener, capture, listenerScope);
  }

  hasListener(type?: string, capture?: boolean | undefined): boolean {
    return this._listeners.hasListener(type, capture);
  }
}

addImplementation(PlayerListenable);
