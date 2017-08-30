export declare interface BaseMessage {
  id: string;
}

export declare interface ConnectedMessage extends BaseMessage {
  remoteId: string;
}

export declare interface PayloadMessage extends ConnectedMessage {
  payload: any;
}

export declare interface ConnectMessage extends BaseMessage {
  channel: string;
}