import Component from './component';
import array from 'goog:goog.array';
import { injectJS, injectJSFile } from '../utils/script';
import asserts from 'goog:goog.asserts';
import { Channel, EventType } from '../messaging/channel';
import { ServicePort } from '../messaging/serviceport';

/**
 * The core that's injected into the unsafe window scope.
 * @define {!string}
 */
goog.define("CORE_INJECT_JS", "");

/**
 * The core that's injected into the unsafe window scope.
 * @define {!string}
 */
goog.define("CORE_INJECT_JS_FILE", "");

export class App extends Component {
  /**
   * @constructor
   * @param {?goog.storage.Storage} storage the storage instance.
   */
  constructor(storage) {
    super();

    /**
     * The ports connected.
     * @private {!Array<ServicePort>}
     */
    this.ports_ = [];

    /**
     * @private {?goog.storage.Storage} the storage instance.
     */
    this.storage_ = storage;

    /**
     * The channel that can receive connection requests. This part is considered
     * unsafe, but with correct handling it shouldn't expose sensitive data.
     * @private {!Channel}
     */
    this.channel_ = new Channel("background");
  }

  /**
   * @override
   */
  enterDocument() {
    super.enterDocument();
    this.channel_.enterDocument();

    this.getHandler()
      .listen(this.channel_, EventType.CONNECT, this.handleChannelConnect_, false);

    array.forEach(this.ports_, function(port) {
      port.enterDocument();
    }, this);
  }

  /**
   * @override
   */
  exitDocument() {
    this.getHandler()
      .removeAll();
    this.channel_.exitDocument();

    array.forEach(this.ports_, function(port) {
      port.exitDocument();
    }, this);

    super.exitDocument();
  }

  /**
   * Attempts to handle channel connect.
   * @private
   * @param {}
   */
  handleChannelConnect_(e) {
    var port = new ServicePort(e.port);
    this.ports_.push(port);
    if (this.isInDocument()) {
      port.enterDocument();
    }
  }

  /**
   * Inject script into page.
   * @return {!Element}
   */
  inject() {
    asserts.assert(!!(CORE_INJECT_JS && CORE_INJECT_JS_FILE),
      "Both CORE_INJECT_JS and CORE_INJECT_JS_FILE are empty.")
    if (CORE_INJECT_JS) {
      return injectJS(CORE_INJECT_JS);
    } else {
      return injectJSFile(CORE_INJECT_JS_FILE);
    }
  }

  /**
   * @override
   */
  disposeInternal() {
    super.disposeInternal();

    for (var i = 0; i < this.ports_.length; i++) {
      this.ports_[i].dispose();
    }

    if (this.channel_) {
      this.channel_.dispose();
    }

    this.channel_ = null;
    this.storage_ = null;
    this.ports_ = null;
  }

  /**
   * Returns the storage instance.
   * @return {?goog.storage.Storage} the storage instance.
   */
  getStorage() {
    return this.storage_;
  }
}
