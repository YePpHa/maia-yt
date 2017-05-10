import { ChannelPort, EventType, PortState } from '../messaging/channelport';
import { ServicePort } from '../messaging/serviceport';
import { Component } from '../core/component';

export class App extends Component {
  constructor() {
    super();

    /**
     * @private {!ChannelPort}
     */
    this.port_ = new ChannelPort();

    /**
     * @private {!ServicePort}
     */
    this.service_ = new ServicePort(this.port_);
  }

  /**
   * Connect the port with the master.
   */
  connect() {
    if (this.port_.getState() !== PortState.UNINITIALIZED) return;
    this.port_.connect("background");
  }

  /**
   * Returns the service port.
   * @return {!ServicePort}
   */
  getService() {
    return this.service_;
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();

    this.service_.dispose();
    this.port_.dispose();

    delete this.service_;
    delete this.port_;
  }

  /** @override */
  enterDocument() {
    super.enterDocument();

    this.service_.enterDocument();
  }

  /** @override */
  exitDocument() {
    this.service_.exitDocument();

    super.exitDocument();
  }
}
