import Event from 'goog:goog.events.Event';
import Map from 'goog:goog.structs.Map';
import json from 'goog:goog.json';
import { getRandomString } from 'goog:goog.string';
import { DomEventType as ChannelDomEventType } from './channeleventtype';
import { createCustomEvent } from './customevent';
import { Component } from '../core/component';

/**
 * @enum {!string}
 */
export const EventType = {
  MESSAGE: 'message'
};

const DomEventType = {
  MESSAGE: '__maiaPortMessage'
};

/**
 * @enum {!number}
 */
export const PortState = {
  UNINITIALIZED: 0,
  AWAITING_RESPONSE: 1,
  CONNECTED: 2
};

export class MessageEvent extends Event {
  /**
   * @param {?Object} payload the payload.
   * @param {Object=} opt_target optional target.
   */
  constructor(payload, opt_target) {
    super(EventType.MESSAGE, opt_target);

    /**
     * The payload.
     * @type {?Object}
     */
    this.payload = payload;
  }
}

export class ChannelPort extends Component {
  constructor() {
    super();

    /**
     * The port ID used to identify this instance of port.
     * @private {?string}
     */
    this.id_ = getRandomString();

    /**
     * The remote port ID that this port is connected to.
     * @private {?string}
     */
    this.remoteId_ = null;

    /**
     * The state of the port.
     * @private {?PortState}
     */
    this.state_ = PortState.UNINITIALIZED;
  }

  /**
   * Enter the channel into the document.
   */
  enterDocument() {
    super.enterDocument();
    this.getHandler()
      .listen(document.documentElement, DomEventType.MESSAGE, this.handleMessage_, false);
  }

  /**
   * Attempts to handle message from DOM.
   * @param {?goog.events.BrowserEvent} e the event object.
   * @protected
   */
  handleMessage_(e) {
    var browserEvent = e.getBrowserEvent();

    var detail = /** @type {?string} */ (browserEvent['detail']);
    var payload = json.parse(detail);

    if (payload['id'] !== this.getId()) return;
    if (payload['remoteId'] !== this.getRemoteId()) return;

    this.dispatchEvent(new MessageEvent(payload['payload'], this));
  }

  /**
   * Attempts to handle connect response.
   * @param {?goog.events.BrowserEvent} e the event object.
   * @protected
   */
  handleConnectResponse_(e) {
    var browserEvent = e.getBrowserEvent();

    var detail = /** @type {?string} */ (browserEvent['detail']);
    var payload = json.parse(detail);

    var portId = payload['id'];
    if (portId !== this.getId()) return;

    var remotePortId = payload['remoteId'];
    this.setRemoteId(remotePortId);

    this.setState(PortState.CONNECTED);

    this.getHandler()
      .unlisten(document.documentElement, ChannelDomEventType.CONNECT_RESPONSE, this.handleConnectResponse_, false);

    document.documentElement.dispatchEvent(createCustomEvent(ChannelDomEventType.CONNECTED,
      json.serialize({
        'id': remotePortId,
        'remoteId': portId
      })
    ));
  }

  /**
   * Returns the ID.
   * @return {?string} the ID.
   */
  getId() {
    return this.id_;
  }

  /**
   * Returns the remote ID.
   * @return {?string} the remote ID.
   */
  getRemoteId() {
    return this.remoteId_;
  }

  /**
   * Set the remote ID.
   * @param {?string} remoteId the remote ID.
   */
  setRemoteId(remoteId) {
    this.remoteId_ = remoteId;
  }

  /**
   * Returns the state.
   * @return {?PortState} the state.
   */
  getState() {
    return this.state_;
  }

  /**
   * Set the state.
   * @param {?PortState} state the state.
   */
  setState(state) {
    this.state_ = state;
  }

  /**
   * Sends payload.
   * @param {?Object} payload the payload to send.
   */
  send(payload) {
    if (this.getState() !== PortState.CONNECTED)
      throw new Error("Port hasn't been connected.");

    var detail = {};
    detail['id'] = this.getRemoteId();
    detail['remoteId'] = this.getId();
    detail['payload'] = payload;

    document.documentElement.dispatchEvent(createCustomEvent(DomEventType.MESSAGE, json.serialize(detail)));
  }

  /**
   * Connect the port through the channel.
   * @param {?string} channel the channel name.
   */
  connect(channel) {
    if (this.getState() !== PortState.UNINITIALIZED)
      if (this.getState() === PortState.AWAITING_RESPONSE)
        throw new Error("The port is being connected.");
      else if (this.getState() === PortState.CONNECTED)
        throw new Error("The port has already been connected.");

    this.enterDocument();
    this.getHandler()
      .listen(document.documentElement, ChannelDomEventType.CONNECT_RESPONSE, this.handleConnectResponse_, false);

    var detail = {};
    detail['id'] = this.getId();
    detail['channel'] = channel;

    document.documentElement.dispatchEvent(createCustomEvent(ChannelDomEventType.CONNECT_REQUEST, json.serialize(detail)));
  }

  /**
   * Connect the port through the channel.
   * @param {?string} channel the channel name.
   * @return {?ChannelPort} the connected port.
   */
  static connect(channel) {
    var port = new ChannelPort();
    port.connect(channel);

    return port;
  }
}
