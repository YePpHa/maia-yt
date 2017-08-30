import { ListenableKey } from './ListenableKey';
import { Listenable, isImplementedBy as isImplementedByListenable } from './Listenable';
import { ListenerMap } from './ListenerMap';
import { PASSIVE_EVENTS } from './BrowserFeature';
import { Listener } from './Listener';
import { EventLike } from './Event';
import { BrowserEvent } from './BrowserEvent';
import { EventTarget as EventTarget2 } from './EventTarget';

export declare interface ProxyFunction extends Function {
  src?: EventTarget;
  listener?: ListenableKey;
}

declare interface ListenableKeyRemoved extends ListenableKey {
  removed: boolean;
}

const _LISTENER_MAP_PROP: string = '_listenerMap_' + ((Math.random() * 1e6) | 0);
const _handleBrowserEvent: Function = (src: EventTarget|undefined, listener: Listener|undefined, event?: Event): any => {
  if (!listener) return;

  if (listener.removed) {
    return true;
  }
  return fireListener(listener, new BrowserEvent(event, src));
}

let _listenerCountEstimate: number = 0;

function _listen(src: EventTarget, type: string, listener: Function, callOnce: boolean = false, options: boolean|AddEventListenerOptions = false, scope?: Object): ListenableKey {
  let listenerMap: ListenerMap|undefined = _getListenerMap(src);
  if (!listenerMap) {
    (src as any)[_LISTENER_MAP_PROP] = listenerMap = new ListenerMap(src);
  }
  let capture: boolean = typeof options === 'object' ? !!options.capture : !!options;

  let listenerObj = listenerMap.add(type, listener, callOnce, capture, scope);
  if (listenerObj.proxy) {
    return listenerObj;
  }

  let proxy = getProxy();
  listenerObj.proxy = proxy;

  proxy.src = src;
  proxy.listener = listenerObj;

  // Don't pass an object as `capture` if the browser doesn't support that.
  if (!PASSIVE_EVENTS) {
    options = capture;
  }
  src.addEventListener(type.toString(), proxy as EventListener, options);

  _listenerCountEstimate++;
  return listenerObj;
}

function _getListenerMap(src: EventTarget): ListenerMap|undefined {
  let listenerMap = (src as any)[_LISTENER_MAP_PROP];
  return listenerMap instanceof ListenerMap ? listenerMap : undefined;
}

export function fireListener(listener: Listener, eventObject: Object): any {
  let listenerFn = listener.listener;
  let listenerHandler = listener.handler || listener.src;

  if (listener.callOnce) {
    unlistenByKey(listener);
  }
  return listenerFn.call(listenerHandler, eventObject);
}

export function getProxy(): ProxyFunction {
  let proxyCallbackFunction = _handleBrowserEvent;
  // Use a local let f to prevent one allocation.
  let f: ProxyFunction = (eventObject: Event) =>
    proxyCallbackFunction.call(
      null,
      f.src,
      f.listener,
      eventObject
    );
  return f;
}

export function listen(src: ListenableType, type: string, listener: Function, options: boolean|AddEventListenerOptions = false, scope?: Object): ListenableKey {
  if (isImplementedByListenable(src)) {
    let capture: boolean = typeof options === 'object' ? !!options.capture : !!options;
    return (<Listenable> src).listen(type, listener, capture, scope);
  } else {
    return _listen((<EventTarget> src), type, listener, false, options, scope);
  }
}

export function listenOnce(src: ListenableType, type: string, listener: Function, options: boolean|AddEventListenerOptions = false, scope?: Object): ListenableKey {
  if (isImplementedByListenable(src)) {
    let capture: boolean = typeof options === 'object' ? !!options.capture : !!options;
    return (<Listenable> src).listenOnce(type, listener, capture, scope);
  } else {
    return _listen((<EventTarget> src), type, listener, true, options, scope);
  }
}

export function unlisten(src: ListenableType, type: string, listener: Function, options: boolean|AddEventListenerOptions = false, scope?: Object): boolean {
  let capture: boolean = typeof options === 'object' ? !!options.capture : !!options;

  if (isImplementedByListenable(src)) {
    return (<Listenable> src).unlisten(type, listener, capture, scope);
  }

  let listenerMap = _getListenerMap(<EventTarget> src);
  if (listenerMap) {
    let listenerObj = listenerMap.getListener(type, listener, capture, scope);
    if (listenerObj) {
      return unlistenByKey(listenerObj);
    }
  }

  return false;
}

export function unlistenByKey(listener: ListenableKey): boolean {
  if (!listener || (listener as ListenableKeyRemoved).removed) {
    return false;
  }

  let src = listener.src;
  if (isImplementedByListenable(src)) {
    return (<Listenable> src).unlistenByKey(listener);
  }

  let type = listener.type;
  let proxy = <EventListener> listener.proxy;

  let domSrc = <EventTarget> src;

  domSrc.removeEventListener(type, proxy, listener.capture);
  _listenerCountEstimate--;

  let listenerMap = _getListenerMap(<EventTarget> src);
  if (listenerMap) {
    listenerMap.removeByKey(listener);
    if (listenerMap.getTypeCount() == 0) {
      listenerMap.src = undefined;
      (src as any)[_LISTENER_MAP_PROP] = undefined;
    }
  } else {
    (<Listener> listener).markAsRemoved();
  }

  return true;
}

export function removeAll(src?: ListenableType, type?: string): number {
  if (!src) return 0;
  if (isImplementedByListenable(src)) {
    return (<Listenable> src).removeAllListeners(type);
  }

  let listenerMap = _getListenerMap(<EventTarget> src);
  if (!listenerMap) {
    return 0;
  }

  let count = 0;
  let typeStr = type;
  for (let type in listenerMap.listeners) {
    if (!typeStr || type == typeStr) {
      // Clone so that we don't need to worry about unlistenByKey
      // changing the content of the ListenerMap.
      let listeners = listenerMap.listeners[type].concat();
      for (let i = 0; i < listeners.length; ++i) {
        if (unlistenByKey(listeners[i])) {
          ++count;
        }
      }
    }
  }
  return count;
}

export function getListeners(src: ListenableType, type: string, capture: boolean): ListenableKey[] {
  if (isImplementedByListenable(src)) {
    return (<Listenable> src).getListeners(type, capture);
  } else {
    let listenerMap = _getListenerMap(<EventTarget> src);
    return listenerMap ? listenerMap.getListeners(type, capture) : [];
  }
}

export function getListener(src: ListenableType, type: string, listener: Function, capture: boolean = false, scope?: Object): ListenableKey|undefined {
  if (isImplementedByListenable(src)) {
    return (<Listenable> src).getListener(type, listener, capture, scope);
  }

  let listenerMap = _getListenerMap(<EventTarget> src);
  if (listenerMap) {
    return listenerMap.getListener(type, listener, capture, scope);
  }
  return undefined;
}

export function hasListener(src: ListenableType, type?: string, capture?: boolean): boolean {
  if (isImplementedByListenable(src)) {
    return (<Listenable> src).hasListener(type || '', capture);
  }

  let listenerMap = _getListenerMap(<EventTarget> src);
  return !!listenerMap && listenerMap.hasListener(type, capture);
}

export function dispatchEvent(src: Listenable, event: EventLike) {
  return src.dispatchEvent(event);
}

export function getTotalListenerCount(): number {
  return _listenerCountEstimate;
}

export type ListenableType = EventTarget|Listenable;
export type Key = number|ListenableKey;