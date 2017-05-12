import Listenable from 'goog:goog.events.Listenable';
import ListenerMap from 'goog:goog.events.ListenerMap';
import Disposable from 'goog:goog.Disposable';
import Map from 'goog:goog.structs.Map';
import structs from 'goog:goog.structs';
import Event from 'goog:goog.events.Event';

export class PlayerEvent extends Event {
  /**
   * @param {*} detail the player event detail.
   * @param {!string} type the event type.
   * @param {Object=} opt_target optional target.
   */
  constructor(detail, type, opt_target) {
    super(type, opt_target);

    /**
     * The detail of the event.
     * @type {*}
     */
    this.detail = detail;
  }
}

/**
 * @implements {goog.events.Listenable}
 */
export class PlayerListenable extends Disposable {
  /**
   * @param {?Object} api the api interface.
   */
  constructor(api) {
    super();

    /**
     * @private {?Object}
     */
    this.api_ = api;

    /**
     * Maps of event type to an array of listeners.
     * @private {!goog.events.ListenerMap}
     */
    this.listeners_ = new ListenerMap(this);

    /**
     * @private {!goog.structs.Map<number, Array>}
     */
    this.proxy_ = new Map();
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();

    this.removeAllListeners();
  }

  /** @override */
  dispatchEvent(e) {
    throw new Error("Not implemented.");
  }

  /** @override */
  fireListeners(type, capture, eventObject) {
    throw new Error("Not implemented.");
  }

  /** @override */
  getListener(type, listener, capture, opt_listenerScope) {
    return this.listeners_.getListener(
      String(type), listener, capture, opt_listenerScope);
  }

  /** @override */
  getListeners(type, capture) {
    return this.listeners_.getListeners(String(type), capture);
  }

  /** @override */
  getParentEventTarget() {
    return null;
  }

  /** @override */
  hasListener(opt_type, opt_capture) {
    var id = goog.isDef(opt_type) ? String(opt_type) : undefined;
    return this.listeners_.hasListener(id, opt_capture);
  }

  /** @override */
  listen(type, listener, opt_useCapture, opt_listenerScope) {
    var key = this.listeners_.add(
      String(type), listener, false /* callOnce */, opt_useCapture,
      opt_listenerScope);
    var proxy = [
      String(key.type),
      function(detail) {
        return key.listener.call(key.handler,
          new PlayerEvent(detail, String(key.type),
          key.src));
      }
    ];
    this.proxy_.set(key.key, proxy);
    this.api_['addEventListener'](proxy[0], proxy[1]);

    return key;
  }

  /** @override */
  listenOnce(type, listener, opt_useCapture, opt_listenerScope) {
    var key = this.listeners_.add(
      String(type), listener, true /* callOnce */, opt_useCapture,
      opt_listenerScope);
    var proxy = [
      String(key.type),
      function(detail) {
        this.unlistenByKey(key);

        return key.listener.call(key.handler,
          new PlayerEvent(detail, String(key.type),
          key.src));
      }.bind(this)
    ];
    this.proxy_.set(key.key, proxy);
    this.api_['addEventListener'](proxy[0], proxy[1]);

    return key;
  }

  /** @override */
  removeAllListeners(opt_type) {
    if (!this.listeners_) {
      return 0;
    }

    structs.forEach(this.listeners_, function(key) {
      if (opt_type && key.type !== opt_type) return;

      var proxy = this.proxy_.get(key.key);
      this.proxy_.remove(key.key);

      this.api_['removeEventListener'](proxy[0], proxy[1]);
    }, this);

    return this.listeners_.removeAll(opt_type);
  }

  /** @override */
  unlisten(type, listener, opt_useCapture, opt_listenerScope) {
    var key = this.getListener(type, listener, !!opt_useCapture, opt_listenerScope);
    var proxy = this.proxy_.get(key.key);
    this.proxy_.remove(key.key);

    this.api_['removeEventListener'](proxy[0], proxy[1]);

    return this.listeners_.remove(
      String(type), listener, opt_useCapture, opt_listenerScope);
  }

  /** @override */
  unlistenByKey(key) {
    var proxy = this.proxy_.get(key.key);
    this.proxy_.remove(key.key);

    this.api_['removeEventListener'](proxy[0], proxy[1]);

    return this.listeners_.removeByKey(key);
  }
}
Listenable.addImplementation(PlayerListenable);
