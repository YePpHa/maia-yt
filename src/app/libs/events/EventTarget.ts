import { Listener } from './Listener';
import { ListenableKey } from './ListenableKey';
import { Disposable } from '../Disposable';
import { Listenable, addImplementation } from './Listenable';
import { ListenerMap } from './ListenerMap';
import { Event, EventLike } from './Event';

const MAX_ANCESTORS = 1000;

export class EventTarget extends Disposable implements Listenable {
  private _eventTargetListeners: ListenerMap = new ListenerMap(this);
  private _parentEventTarget: EventTarget;
  private _actualEventTarget: EventTarget = this;

  constructor() {
    super();
  }

  protected disposeInternal() {
    super.disposeInternal();

    this.removeAllListeners();
  }

  setParentEventTarget(parent: EventTarget) {
    this._parentEventTarget = parent;
  }

  getParentEventTarget(): EventTarget {
    return this._parentEventTarget;
  }
  
  dispatchEvent(event: EventLike): boolean {
    let ancestorsTree: EventTarget[]|undefined,
      ancestor = this.getParentEventTarget();
    if (ancestor) {
      ancestorsTree = [];
      let ancestorCount = 1;
      for (; ancestor; ancestor = ancestor.getParentEventTarget()) {
        ancestorsTree.push(ancestor);
        console.assert((++ancestorCount < MAX_ANCESTORS), 'infinite loop');
      }
    }

    return this._dispatchEventInternal(this._actualEventTarget, event, ancestorsTree);
  }
  
  listen(type: string, listener: Function, useCapture?: boolean, listenerScope?: Object): ListenableKey {
    return this._eventTargetListeners.add(type, listener, false, useCapture, listenerScope);
  }

  listenOnce(type: string, listener: Function, useCapture?: boolean, listenerScope?: Object): ListenableKey {
    return this._eventTargetListeners.add(type, listener, true, useCapture, listenerScope);
  }

  unlisten(type: string, listener: Function, useCapture?: boolean, listenerScope?: Object): boolean {
    return this._eventTargetListeners.remove(type, listener, useCapture, listenerScope);
  }

  unlistenByKey(key: ListenableKey): boolean {
    return this._eventTargetListeners.removeByKey(key);
  }
  
  removeAllListeners(): number {
    if (!this._eventTargetListeners) {
      return 0;
    }

    return this._eventTargetListeners.removeAll();
  }

  fireListeners(type: string, capture: boolean, event: Event) {
    let listenerArray = this._eventTargetListeners.listeners[String(type)];
    if (!listenerArray) {
      return true;
    }
    listenerArray = listenerArray.concat();
  
    let rv = true;
    for (let i = 0; i < listenerArray.length; i++) {
      let listener = listenerArray[i];
      // We might not have a listener if the listener was removed.
      if (listener && !listener.removed && listener.capture === capture) {
        let listenerFn = listener.listener;
        let listenerHandler = listener.handler || listener.src;
  
        if (listener.callOnce) {
          this.unlistenByKey(listener);
        }
        rv = listenerFn.call(listenerHandler, event) !== false && rv;
      }
    }
  
    return rv && !event.isReturnValue();
  }

  getListeners(type: string, capture: boolean): ListenableKey[] {
    return this._eventTargetListeners.getListeners(type, capture);
  }

  getListener(type: string, listener: Function, capture: boolean, listenerScope?: Object): ListenableKey|undefined {
    return this._eventTargetListeners.getListener(type, listener, capture, listenerScope);
  }

  hasListener(type?: string, capture?: boolean): boolean {
    return this._eventTargetListeners.hasListener(type, capture);
  }
  
  private _dispatchEventInternal(target: EventTarget, eventLike: EventLike, ancestorsTree?: EventTarget[]) {
    let event: Event;
    if (typeof eventLike === 'string') {
      event = new Event(eventLike, target);
    } else if (!(eventLike instanceof Event)) {
      event = Object.assign(new Event((eventLike as { type: string }).type, target), eventLike);
    } else {
      event = eventLike;
      event.target = eventLike.target || target;
    }

    let type = event.type, returnValue = true;

    if (ancestorsTree) {
      for (let i = ancestorsTree.length - 1; !event.isPropagationStopped() && i >= 0; i--) {
        let currentTarget = event.currentTarget = ancestorsTree[i];
        returnValue = currentTarget.fireListeners(type, true, event)
          && returnValue;
      }
    }

    // Executes capture and bubble listeners on the target.
    if (!event.isPropagationStopped()) {
      let currentTarget = event.currentTarget = target;
      returnValue = currentTarget.fireListeners(type, true, event) && returnValue;
      if (!event.isPropagationStopped()) {
        returnValue = currentTarget.fireListeners(type, false, event) && returnValue;
      }
    }

    // Executes all bubble listeners on the ancestors, if any.
    if (ancestorsTree) {
      for (let i = 0; !event.isPropagationStopped() && i < ancestorsTree.length; i++) {
        let currentTarget = event.currentTarget = ancestorsTree[i];
        returnValue = currentTarget.fireListeners(type, false, event) && returnValue;
      }
    }

    return returnValue;
  }
}

addImplementation(EventTarget);