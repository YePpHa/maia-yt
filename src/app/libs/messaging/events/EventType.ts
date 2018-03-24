export enum EventType {
  Message = 'message',
  Connect = 'connect'
}

export enum InternalEventType {
  ConnectRequest = '__maiaChannelConnectRequest',
  ConnectResponse = '__maiaChannelConnectResponse',
  Connected = '__maiaChannelConnected',
  Message = '__maiaPortMessage'
}