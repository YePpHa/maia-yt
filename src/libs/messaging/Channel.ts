import { BrowserEvent } from '../events/BrowserEvent';
import { ElementComponent } from '../ElementComponent';
import { ChannelPort } from './ChannelPort';
import { PortState } from './PortState';
import { PortEvent } from './events/PortEvent';
import { InternalEventType } from './events/EventType';
import { createCustomEvent } from '../dom';
import { ConnectedMessage, PayloadMessage, ConnectMessage } from './Message';

export class Channel extends ElementComponent {
  private _name: string;
  private _ports: {[key: string]: ChannelPort} = {};

  constructor(name: string) {
    super();

    this._name = name;
  }

  protected disposeInternal() {
    super.disposeInternal();
    for (let key in this._ports) {
      if (this._ports[key].hasOwnProperty(key)) {
        this._ports[key].dispose();
      }
    }
  }

  /**
   * Enter the channel into the document.
   */
  enterDocument() {
    super.enterDocument();

    this.getHandler()
      .listen(document.documentElement, InternalEventType.CONNECT_REQUEST, this._handleConnectRequest, false)
      .listen(document.documentElement, InternalEventType.CONNECTED, this._handleConnected, false);
  }

  /**
   * Returns the name.
   */
  getName(): string {
    return this._name;
  }

  /**
   * Attempts to handle connect event.
   * @param e the browser event that contains the payload.
   */
  protected _handleConnectRequest(e: BrowserEvent) {
    let browserEvent = e.getBrowserEvent() as CustomEvent;

    let detail = browserEvent.detail as string;
    let payload = JSON.parse(detail) as ConnectMessage;
    if (typeof payload !== "object")
      throw new Error("Payload is not an object.");

    let channel = payload.channel;
    if (channel !== this.getName()) return;

    let id = payload.id;

    let port = new ChannelPort();
    port.setRemoteId(id);
    port.enterDocument();

    this._ports[port.getId()] = port;

    let response: ConnectedMessage = {
      'remoteId': port.getId(),
      'id': id
    }
    document.documentElement.dispatchEvent(
      createCustomEvent(
        InternalEventType.CONNECT_RESPONSE,
        JSON.stringify(response)
      )
    );
  }

  /**
   * Attempts to handle connected event.
   * @param e the browser event that contains the payload.
   */
  protected _handleConnected(e: BrowserEvent) {
    let browserEvent = e.getBrowserEvent() as CustomEvent;

    let detail = browserEvent.detail as string;
    let payload = JSON.parse(detail) as ConnectedMessage;
    if (typeof payload !== "object")
      throw new Error("Payload is not an object.");

    let id: string = payload.id;
    if (!this._ports.hasOwnProperty(id)) return;
    let port = this._ports[id];

    if (port.getRemoteId() !== payload.remoteId) return;
    delete this._ports[id];

    port.setState(PortState.CONNECTED);

    this.dispatchEvent(new PortEvent(port, this));
  }
}
