export enum EventType {
  MESSAGE = 'message',
  CONNECT = 'connect'
}

export enum InternalEventType {
  CONNECT_REQUEST = '__maiaChannelConnectRequest',
  CONNECT_RESPONSE = '__maiaChannelConnectResponse',
  CONNECTED = '__maiaChannelConnected',
  MESSAGE = '__maiaPortMessage'
}