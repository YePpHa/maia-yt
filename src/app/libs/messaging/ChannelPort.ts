import { InternalEventType } from './events/EventType';
import { createCustomEvent } from '../dom';
import { ElementComponent } from '../ElementComponent';
import { PortState } from './PortState';
import { MessageEvent } from './events/MessageEvent';
import { BrowserEvent } from '../events/BrowserEvent';
import { ConnectedMessage, PayloadMessage, ConnectMessage } from './Message';
import { v4 as uuidv4 } from 'uuid';

export class ChannelPort extends ElementComponent {
  private _id: string = uuidv4();
  private _remoteId: string;
  private _state: PortState = PortState.Uninitialized;

  /**
   * Enter the channel into the document.
   */
  enterDocument() {
    super.enterDocument();

    this.getHandler()
      .listen(document.documentElement, InternalEventType.Message, this._handleMessage, false);
  }

  /**
   * Attempts to handle message from DOM.
   * @param e the event object.
   * @protected
   */
  protected _handleMessage(e: BrowserEvent) {
    let browserEvent = e.getBrowserEvent() as CustomEvent;

    let detail = browserEvent.detail as string;
    let payload = JSON.parse(detail) as PayloadMessage;
    if (typeof payload !== "object")
      throw new Error("Payload is not an object.");

    if (payload.id !== this.getId()) return;
    if (payload.remoteId !== this.getRemoteId()) return;

    this.dispatchEvent(new MessageEvent(payload.payload, this));
  }

  /**
   * Attempts to handle connect response.
   * @param e the event object.
   * @protected
   */
  protected _handleConnectResponse(e: BrowserEvent) {
    let browserEvent = e.getBrowserEvent() as CustomEvent;

    let detail = browserEvent.detail as string;
    let payload = JSON.parse(detail) as ConnectedMessage;
    if (typeof payload !== "object")
      throw new Error("Payload is not an object.");

    let portId = payload.id;
    if (portId !== this.getId()) return;

    let remotePortId = payload.remoteId;
    this.setRemoteId(remotePortId);

    this.setState(PortState.Connected);

    this.getHandler()
      .unlisten(document.documentElement, InternalEventType.ConnectResponse, this._handleConnectResponse, false);

    let responseMessage: ConnectedMessage = {
      'id': remotePortId,
      'remoteId': portId
    };
    document.documentElement.dispatchEvent(
      createCustomEvent(
        InternalEventType.Connected,
        JSON.stringify(responseMessage)
      )
    );
  }

  /**
   * Returns the ID.
   */
  getId(): string {
    return this._id;
  }

  /**
   * Returns the remote ID.
   */
  getRemoteId(): string {
    return this._remoteId;
  }

  /**
   * Set the remote ID.
   * @param remoteId the remote ID.
   */
  setRemoteId(remoteId: string): void {
    this._remoteId = remoteId;
  }

  /**
   * Returns the state.
   */
  getState(): PortState {
    return this._state;
  }

  /**
   * Set the state.
   * @param state the state.
   */
  setState(state: PortState): void {
    this._state = state;
  }

  /**
   * Sends payload.
   * @param payload the payload to send.
   */
  send(payload: Object): void {
    if (this.getState() !== PortState.Connected)
      throw new Error("Port hasn't been connected.");

    let detail: PayloadMessage = {
      id: this.getRemoteId(),
      remoteId: this.getId(),
      payload: payload
    };

    document.documentElement.dispatchEvent(
      createCustomEvent(
        InternalEventType.Message,
        JSON.stringify(detail)
      )
    );
  }

  /**
   * Connect the port through the channel.
   * @param channel the channel name.
   */
  connect(channel: string) {
    if (this.getState() !== PortState.Uninitialized)
      if (this.getState() === PortState.AwaitingResponse)
        throw new Error("The port is being connected.");
      else if (this.getState() === PortState.Connected)
        throw new Error("The port has already been connected.");

    this.enterDocument();
    this.getHandler()
      .listen(document.documentElement, InternalEventType.ConnectResponse, this._handleConnectResponse, false);

    let detail: ConnectMessage = {
      id: this.getId(),
      channel: channel
    };

    document.documentElement.dispatchEvent(
      createCustomEvent(
        InternalEventType.ConnectRequest,
        JSON.stringify(detail)
      )
    );
  }

  /**
   * Connect the port through the channel.
   * @param channel the channel name.
   */
  static connect(channel: string): ChannelPort {
    let port = new ChannelPort();
    port.connect(channel);

    return port;
  }
}
