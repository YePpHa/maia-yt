import { Listenable } from './Listenable';
import { ListenableKey } from './ListenableKey';
import { Listener } from './Listener';

export class ListenerMap {
  public listeners: { [key: string]: Listener[] } = {};
  private _typeCount: number = 0;

  constructor(
    public src: EventTarget|Listenable|undefined
  ) {}

  getTypeCount(): number {
    return this._typeCount;
  }

  getListenerCount(): number {
    let count = 0;
    for (let type in this.listeners) {
      count += this.listeners[type].length;
    }
    return count;
  }

  add(type: string, listener: Function, callOnce: boolean, useCapture?: boolean,
      listenerScope?: Object): ListenableKey {
        let listenerArray = this.listeners[type];
    if (!listenerArray) {
      listenerArray = this.listeners[type] = [];
      this._typeCount++;
    }
  
    let listenerObj;
    let index = ListenerMap._findListenerIndex(
        listenerArray, listener, useCapture, listenerScope);
    if (index > -1) {
      listenerObj = listenerArray[index];
      if (!callOnce) {
        // Ensure that, if there is an existing callOnce listener, it is no
        // longer a callOnce listener.
        listenerObj.callOnce = false;
      }
    } else {
      listenerObj = new Listener(
          listener, undefined, this.src, type, !!useCapture, listenerScope);
      listenerObj.callOnce = callOnce;
      listenerArray.push(listenerObj);
    }
    return listenerObj;
  }

  remove(type: string, listener: Function, useCapture?: boolean, listenerScope?: Object): boolean {
    if (!(type in this.listeners)) {
      return false;
    }
  
    let listenerArray = this.listeners[type];
    let index = ListenerMap._findListenerIndex(
        listenerArray, listener, useCapture, listenerScope);
    if (index > -1) {
      let listenerObj = listenerArray[index];
      if (listenerObj instanceof Listener) {
        listenerObj.markAsRemoved();
      }
      listenerArray.splice(index, 1);
      if (listenerArray.length == 0) {
        delete this.listeners[type];
        this._typeCount--;
      }
      return true;
    }
    return false;
  }

  removeByKey(listener: ListenableKey): boolean {
    let type = listener.type;
    if (!(type in this.listeners)) {
      return false;
    }

    let index = (<ListenableKey[]> this.listeners[type]).indexOf(listener);
    if (index !== -1) {
      this.listeners[type].splice(index, 1);
      if (listener instanceof Listener) {
        listener.markAsRemoved();
      }
      if (this.listeners[type].length == 0) {
        delete this.listeners[type];
        this._typeCount--;
      }
    }
    return index !== -1;
  }

  removeAll(type?: string): number {
    let count = 0;
    for (let _type in this.listeners) {
      if (!type || _type === type) {
        let listenerArray = this.listeners[_type];
        for (let i = 0; i < listenerArray.length; i++) {
          ++count;
          listenerArray[i].markAsRemoved();
        }
        delete this.listeners[_type];
        this._typeCount--;
      }
    }
    return count;
  }

  getListeners(type: string, capture: boolean): ListenableKey[] {
    let listenerArray = this.listeners[type.toString()];
    let rv: ListenableKey[] = [];
    if (listenerArray) {
      for (let i = 0; i < listenerArray.length; i++) {
        let listenerObj = listenerArray[i];
        if (listenerObj.capture === capture) {
          rv.push(listenerObj);
        }
      }
    }
    return rv;
  }

  getListener(type: string, listener: Function, capture: boolean, listenerScope?: Object): ListenableKey|undefined {
    let listenerArray = this.listeners[type];
    let i = -1;
    if (listenerArray) {
      i = ListenerMap._findListenerIndex(
          listenerArray, listener, capture, listenerScope);
    }
    return i > -1 ? listenerArray[i] : undefined;
  }

  hasListener(type?: string, capture?: boolean): boolean {
    let hasType = type !== undefined;
    let typeStr = hasType ? type : '';
    let hasCapture = capture !== undefined;

    for (let type in this.listeners) {
      let listenerArray = this.listeners[type];
      for (let i = 0; i < listenerArray.length; i++) {
        if ((!hasType || listenerArray[i].type === typeStr) &&
            (!hasCapture || listenerArray[i].capture === capture)) {
          return true;
        }
      }
    }
    return false;
  }

  private static _findListenerIndex(listenerArray: Listener[], listener: Function, useCapture?: boolean, listenerScope?: Object) {
    for (let i = 0; i < listenerArray.length; ++i) {
      let listenerObj = listenerArray[i];
      if (!listenerObj.removed && listenerObj.listener === listener &&
          listenerObj.capture === !!useCapture &&
          listenerObj.handler === listenerScope) {
        return i;
      }
    }
    return -1;
  }
}