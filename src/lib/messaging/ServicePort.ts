import { ChannelPort } from './ChannelPort';
import { MessageEvent } from './events/MessageEvent';
import { Component } from './Component';
import { ServiceError } from './ServiceError';
import { ServiceInstance } from './ServiceInstance';
import { InternalEventType } from './events/InternalEventType';

declare interface ServicePayload {
  type: ServiceType;
  id: string;
}

declare interface ServicePayloadCall extends ServicePayload {
  name: string;
  arguments: any[];
}

declare interface ServicePayloadResponse extends ServicePayload {
  returnValue: any;
}

declare interface ServicePayloadError extends ServicePayload {
  name: string;
  message: string;
}

export enum ServiceType {
  CALL = 'call',
  CALL_RESPONSE = 'call-response',
  CALL_RESPONSE_ERROR = 'call-response-error'
};

export class ServicePort extends Component {
  /**
   * The channel port.
   */
  private _port: ChannelPort;

  private _services: {[key: string]: {fn: Function, scope: Object|null|undefined}} = {};
  private _serviceInstances: {[key: string]: ServiceInstance} = {};
  private _servicesResponseId: number = 0;

  /**
   * @param {?ChannelPort} port the port.
   */
  constructor(port: ChannelPort) {
    super();

    this._port = port;
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();

    if (this._port) {
      this._port.dispose();
    }

    this._services = {};
    this._serviceInstances = {};
    this._servicesResponseId = 0;
  }

  /**
   * Returns the port.
   */
  getPort(): ChannelPort {
    return this._port;
  }

  /**
   * Enter the channel into the document.
   */
  enterDocument(): void {
    super.enterDocument();

    this.getHandler()
      .listen(this.getPort(), InternalEventType.MESSAGE, this._handleMessage, false);
  }

  /**
   * Register a service.
   * @param name the name of the service.
   * @param fn the service function.
   * @param scope the optional function scope.
   */
  registerService(name: string, fn: Function, scope: Object|null|undefined = null) {
    this._services[name] = { fn: fn, scope: scope };
  }

  /**
   * Deregister the service.
   * @param name the name of the service.
   */
  deregisterService(name: string) {
    delete this._services[name];
  }

  /**
   * Call a service.
   * @param name the name of the service.
   * @param args the arguments that the service will be called with.
   */
  call(name: string, ...args: any[]): Promise<any>|any {
    let id = ++this._servicesResponseId + '';
    let request = {} as ServicePayloadCall;
    request.type = ServiceType.CALL;
    request.id = id;

    request.name = name;
    request.arguments = args;

    let instance = new ServiceInstance();

    this._serviceInstances[id] = instance;

    this._port.send(request);

    if (instance.responseComplete) {
      delete this._serviceInstances[id];

      if (instance.returnError) {
        throw instance.returnError;
      } else {
        return instance.returnValue;
      }
    } else {
      instance.async = true;
      return new Promise((resolve, reject) => {
        instance.promiseResolve = resolve;
        instance.promiseReject = reject;
      });
    }
  }

  /**
   * Calls a service. However, if the service doesn't immediately return a value
   * it will throw an error.
   * @param name the name of the service.
   * @param args the arguments that the service will be called with.
   * @throws if service is async.
   */
  callSync(name: string, ...args: any[]): any {
    let id = ++this._servicesResponseId + '';
    let request = {} as ServicePayloadCall;
    request.type = ServiceType.CALL;
    request.id = id;

    request.name = name;
    request.arguments = args;

    let instance = new ServiceInstance();

    this._serviceInstances[id] = instance;

    this._port.send(request);

    if (instance.responseComplete) {
      delete this._serviceInstances[id];

      if (instance.returnError) {
        throw instance.returnError;
      } else {
        return instance.returnValue;
      }
    } else {
      instance.async = true;
      instance.promiseResolve = function() {};
      instance.promiseReject = function() {};
      throw new Error("The service didn't respond immediately.");
    }
  }

  /**
   * Calls a service. However, if the service does immediately return a value
   * it will throw an error.
   * @param name the name of the service.
   * @param args the arguments that the service will be called with.
   * @throws if service is sync.
   */
  callAsync(name: string, ...args: any[]): Promise<any> {
    let id = ++this._servicesResponseId + '';
    let request = {} as ServicePayloadCall;
    request.type = ServiceType.CALL;
    request.id = id;

    request.name = name;
    request.arguments = args;

    let instance = new ServiceInstance();

    this._serviceInstances[id] = instance;

    this._port.send(request);

    if (instance.responseComplete) {
      delete this._serviceInstances[id];

      throw new Error("The service responded immediately.");
    } else {
      instance.async = true;

      return new Promise((resolve, reject) => {
        instance.promiseResolve = resolve;
        instance.promiseReject = reject;
      });
    }
  }

  /**
   * Attempts to handle the message event.
   * @param e the message event.
   */
  private _handleMessage(e: MessageEvent) {
    let detail = e.payload as ServicePayload;
    let type = detail.type;

    switch (type) {
      case ServiceType.CALL:
        this._handleCallMessage(detail as ServicePayloadCall);
        break;
      case ServiceType.CALL_RESPONSE:
        this._handleCallResponseMessage(detail as ServicePayloadResponse);
        break;
      case ServiceType.CALL_RESPONSE_ERROR:
        this._handleCallResponseErrorMessage(detail as ServicePayloadError);
      default:
        // Throw or report an error here.
        // Type is not valid.
        break;
    }
  }

  /**
   * Attempts to handle the call message.
   * @param detail the detail.
   */
  private _handleCallMessage(detail: ServicePayloadCall) {
    // The ID is used for when sending a response.
    let id = detail.id;

    // The service name.
    let name = detail.name;

    if (this._services.hasOwnProperty(name)) {
      try {
        let service = this._services[name];
        let returnValue = service.fn.apply(service.scope, detail['arguments']);
        if (returnValue instanceof Promise) {
          returnValue
          .then((returnValue) => {
            let response = {} as ServicePayloadResponse;
            response.id = id;
            response.type = ServiceType.CALL_RESPONSE;
            response.returnValue = returnValue;
            this._port.send(response);
          }, (err: Error) => {
            let response = {} as ServicePayloadError;
            response.type = ServiceType.CALL_RESPONSE_ERROR;
            response.name = err.name;
            response.message = err.message;
            this._port.send(response);
          })
        } else {
          let response = {} as ServicePayloadResponse;
          response.id = id;
          response.type = ServiceType.CALL_RESPONSE;
          response.returnValue = returnValue;
        }
      } catch (err) {
        let response = {} as ServicePayloadError;
        response.type = ServiceType.CALL_RESPONSE_ERROR;
        response.name = err.name;
        response.message = err.message;
        this._port.send(response);
      }
    } else {
      let response = {} as ServicePayloadError;
      response.type = ServiceType.CALL_RESPONSE_ERROR;
      response.name = "Error";
      response.message = "Service with name (" + name + ") not found.";
      this._port.send(response);
    }
  }

  /**
   * Attempts to handle the call response message.
   * @param detail the detail.
   */
  private _handleCallResponseMessage(detail: ServicePayloadResponse) {
    let id = detail.id;
    let returnValue = detail.returnValue;
    let instance = this._serviceInstances[id];

    instance.responseComplete = true;

    if (instance.async) {
      // Remove instance from map.
      delete this._serviceInstances[id];

      // Reject the promise.
      instance.promiseResolve(returnValue);
    } else {
      instance.returnValue = returnValue;
    }
  }

  /**
   * Attempts to handle the call response error message.
   * @param detail the detail.
   */
  private _handleCallResponseErrorMessage(detail: ServicePayloadError) {
    let id = detail.id;
    let errorName = detail.name;
    let errorMessage = detail.message;

    let err = new ServiceError(errorName, errorMessage);
    let instance = this._serviceInstances[id];

    instance.responseComplete = true;

    if (instance.async) {
      // Remove instance from map.
      delete this._serviceInstances[id];

      // Reject the promise.
      instance.promiseReject(err);
    } else {
      instance.returnError = err;
    }
  }
}
