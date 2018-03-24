import { Disposable } from '../Disposable';
import { Listener } from './Listener';
import { Key, ListenableType, listen, listenOnce, getListener, unlistenByKey } from './index';
import { EventTarget as LEventTarget } from './EventTarget';
import { ListenableKey } from './ListenableKey';

export class EventHandler extends Disposable {
  private _scope: Object;
  private _keys: {[key: string]: ListenableKey} = {};

  constructor(scope?: any) {
    super();

    this._scope = scope;
  }

  protected disposeInternal() {
    super.disposeInternal();

    this.removeAll();
  }

  listen(src: ListenableType, type: string, fn?: Function, options: boolean|AddEventListenerOptions = false, scope?: Object): EventHandler {
    const listenerObj = listen(src, type, fn || this.handleEvent, options, scope || this._scope || this);

    if (!listenerObj) {
      return this;
    }

    const key = listenerObj.key;
    this._keys[key] = listenerObj;
  
    return this;
  }

  listenOnce(src: ListenableType, type: string, fn?: Function, options: boolean|AddEventListenerOptions = false, scope?: Object): EventHandler {
    const listenerObj = listenOnce(src, type, fn || this.handleEvent, options, scope || this._scope || this);
    
    if (!listenerObj) {
      return this;
    }

    const key = listenerObj.key;
    this._keys[key] = listenerObj;
  
    return this;
  }

  unlisten(src: ListenableType, type: string, fn?: Function, options: boolean|AddEventListenerOptions = false, scope?: Object) {
    const capture = typeof options === 'object' ? !!options.capture : !!options;
    const listener = getListener(src, type, fn || this.handleEvent, capture,
        scope || this._scope || this);

    if (listener) {
      unlistenByKey(listener);
      delete this._keys[listener.key];
    }

    return this;
  }

  removeAll() {
    for (let key in this._keys) {
      let listenerObj = this._keys[key];
      if (this._keys.hasOwnProperty(key)) {
        unlistenByKey(listenerObj);
      }
    }
  
    this._keys = {};
  }

  getListenerCount(): number {
    let count = 0;
    for (let key in this._keys) {
      if (Object.prototype.hasOwnProperty.call(this._keys, key)) {
        count++;
      }
    }
    return count;
  }

  handleEvent() {
    throw new Error('EventHandler.handleEvent not implemented');
  }
}