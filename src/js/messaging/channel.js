import Event from 'goog:goog.events.Event';
import Map from 'goog:goog.structs.Map';
import json from 'goog:goog.json';
import { ChannelPort, PortState } from './channelport';
import { createCustomEvent } from './customevent';
import { DomEventType } from './channeleventtype';
import { Component } from '../core/component';

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

export class Channel extends Component {
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
     * @protected {?goog.structs.Map<string, ChannelPort>}
     */
    this.ports_ = new Map();
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();
  }

  /**
   * Enter the channel into the document.
   */
  enterDocument() {
    super.enterDocument();
    this.getHandler()
      .listen(document.documentElement, DomEventType.CONNECT_REQUEST, this.handleConnectRequest_, false)
      .listen(document.documentElement, DomEventType.CONNECTED, this.handleConnected_, false);
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
