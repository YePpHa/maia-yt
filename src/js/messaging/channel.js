import EventTarget from 'goog:goog.events.EventTarget';
import EventHandler from 'goog:goog.events.EventHandler';
import Event from 'goog:goog.events.Event';
import Map from 'goog:goog.structs.Map';
import json from 'goog:goog.json';
import { ChannelPort, PortState } from './channelport';
import { createCustomEvent } from './customevent';
import { DomEventType } from './channeleventtype';

/**
 * @enum {!string}
 */
export const EventType = {
  CONNECT: 'connect'
};

export class PortEvent extends Event {
  /**
   * @param {?ChannelPort} port the port.
   * @param {Object=} opt_target the optional target.
   */
  constructor(port, opt_target) {
    super(EventType.CONNECT, opt_target);

    /**
     * The port.
     * @type {?ChannelPort}
     */
    this.port = port;
  }
}

export class Channel extends EventTarget {
  /**
   * @param {?string} name the channel name.
   */
  constructor(name) {
    super();

    /**
     * @private {?string}
     */
    this.name_ = name;

    /**
     * The event handler of the channel.
     * @private {?goog.events.EventHandler}
     */
    this.handler_ = null;

    /**
     * Whether the channel has been connected to the document.
     * @private {?boolean}
     */
    this.inDocument_ = false;

    /**
     * @protected {?goog.structs.Map<string, ChannelPort>}
     */
    this.ports_ = new Map();
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();

    if (this.handler_) {
      this.handler_.dispose();
    }
    this.handler_ = null;
  }

  /**
   * Returns whether the channel has been connected to the document.
   * @return {?boolean} whether the channel has been connected to the document.
   */
  isInDocument() {
    return this.inDocument_;
  }

  /**
   * Enter the channel into the document.
   */
  enterDocument() {
    this.getHandler()
      .listen(document.documentElement, DomEventType.CONNECT_REQUEST, this.handleConnectRequest_, false)
      .listen(document.documentElement, DomEventType.CONNECTED, this.handleConnected_, false);
  }

  /**
   * Exit the channel from the document.
   */
  exitDocument() {
    this.getHandler()
      .removeAll();
  }

  /**
   * Returns the event handler.
   * @return {?goog.events.EventHandler} the event handler.
   */
  getHandler() {
    if (!this.handler_) {
      this.handler_ = new EventHandler(this);
    }
    return this.handler_;
  }

  /**
   * Returns the name.
   * @return {?string} the name.
   */
  getName() {
    return this.name_;
  }

  /**
   * Attempts to handle connect event.
   * @param {?goog.events.BrowserEvent} e the event object.
   * @protected
   */
  handleConnectRequest_(e) {
    var browserEvent = e.getBrowserEvent();

    var detail = /** @type {?string} */ (browserEvent['detail']);
    var payload = json.parse(detail);

    var channel = payload['channel'];
    if (channel !== this.getName()) return;

    var id = payload['id'];

    var port = new ChannelPort();
    port.setRemoteId(id);
    port.enterDocument();

    this.ports_.set(port.getId(), port);

    document.documentElement.dispatchEvent(createCustomEvent(DomEventType.CONNECT_RESPONSE,
      json.serialize({
        'remoteId': port.getId(),
        'id': id
      })
    ));
  }

  /**
   * Attempts to handle connect event.
   * @param {?goog.events.BrowserEvent} e the event object.
   * @protected
   */
  handleConnected_(e) {
    var browserEvent = e.getBrowserEvent();

    var detail = /** @type {?string} */ (browserEvent['detail']);
    var payload = json.parse(detail);

    if (!this.ports_.containsKey(payload['id'])) return;
    var port = this.ports_.get(payload['id']);

    if (port.getRemoteId() !== payload['remoteId']) return;
    this.ports_.remove(payload['id']);

    port.setState(PortState.CONNECTED);

    this.dispatchEvent(new PortEvent(port, this));
  }
}
