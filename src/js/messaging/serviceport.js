import Map from 'goog:goog.structs.Map';
import Promise from 'goog:goog.Promise';
import { ChannelPort, EventType, MessageEvent } from '../messaging/channelport';
import { Component } from '../core/component';

/**
 * @enum {!string}
 */
export const ServiceType = {
  CALL: 'call',
  CALL_RESPONSE: 'call-response',
  CALL_RESPONSE_ERROR: 'call-response-error'
};

export class ServiceError extends Error {
  /**
   * @param {!string} name the name of the error.
   * @param {?string} message the message of the error.
   */
  constructor(name, message) {
    super(message);
    this.name = name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class ServiceInstance {
  constructor() {
    /**
     * Whether the instance is async. This is checked after the request has been
     * sent.
     * @public {?boolean}
     */
    this.async = false;

    /**
     * If the instance is async a promise resolve will be set that can be called
     * when a response has been received.
     * @public {?Function}
     */
    this.promiseResolve = null;

    /**
     * If the instance is async a promise reject will be set that can be called
     * when a response has been received.
     * @public {?Function}
     */
    this.promiseReject = null;

    /**
     * The return value if async is false.
     * @public {*}
     */
    this.returnValue = null;

    /**
     * The error if async is false.
     * @public {?ServiceError}
     */
    this.returnError = null;

    /**
     * Whether a response has been received.
     * @public {?boolean}
     */
    this.responseComplete = false;
  }
}

export class ServicePort extends Component {
  /**
   * @param {?ChannelPort} port the port.
   */
  constructor(port) {
    super();

    /**
     * The channel port.
     * @private {?ChannelPort}
     */
    this.port_ = port;

    /**
     * The service map.
     * @private {?goog.structs.Map}
     */
    this.services_ = new Map();

    /**
     * @private {?goog.structs.Map<string, ServiceInstance>}
     */
    this.serviceInstances_ = new Map();

    /**
     * The ID of the call.
     * @private {?number}
     */
    this.servicesResponseId_ = 0;
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();

    if (this.port_) {
      this.port_.dispose();
    }

    this.port_ = null;
    this.services_ = null;
    this.serviceInstances_ = null;
    this.servicesResponseId_ = null;
  }

  /**
   * Returns the port.
   * @return {?ChannelPort} the port.
   */
  getPort() {
    return this.port_;
  }

  /**
   * Enter the channel into the document.
   */
  enterDocument() {
    super.enterDocument();
    this.getHandler()
      .listen(this.getPort(), EventType.MESSAGE, this.handleMessage_, false);
  }

  /**
   * Register a service.
   * @param {?string} name the name of the service.
   * @param {?Function} fn the service function.
   */
  registerService(name, fn) {
    this.services_.set(name, fn);
  }

  /**
   * Deregister the service.
   * @param {?string} name the name of the service.
   */
  deregisterService(name) {
    this.services_.remove(name);
  }

  /**
   * Call a service.
   * @param {?string} name the name of the service.
   * @param {...*} var_args the arguments that the service will be called with.
   */
  call(name, var_args) {
    var args = Array.prototype.slice.call(arguments, 1);

    var id = ++this.servicesResponseId_ + '';
    var request = {};
    request['type'] = ServiceType.CALL;
    request['id'] = id;

    request['name'] = name;
    request['arguments'] = args;

    var instance = new ServiceInstance();

    this.serviceInstances_.set(id, instance);

    this.port_.send(request);

    if (instance.responseComplete) {
      this.serviceInstances_.remove(id);

      if (instance.returnError) {
        throw instance.returnError;
      } else {
        return instance.returnValue;
      }
    } else {
      instance.async = true;
      return new Promise(function(resolve, reject) {
        instance.promiseResolve = resolve;
        instance.promiseReject = reject;
      }, this);
    }
  }

  /**
   * Attempts to handle the message event.
   * @param {?MessageEvent} e the message event.
   * @private
   */
  handleMessage_(e) {
    var detail = e.payload;
    var type = detail['type'];

    switch (type) {
      case ServiceType.CALL:
        this.handleCallMessage_(detail);
        break;
      case ServiceType.CALL_RESPONSE:
        this.handleCallResponseMessage_(detail);
        break;
      case ServiceType.CALL_RESPONSE_ERROR:
        this.handleCallResponseErrorMessage_(detail);
      default:
        // Throw or report an error here.
        // Type is not valid.
        break;
    }
  }

  /**
   * Attempts to handle the call message.
   * @param {?Object} detail the detail.
   */
  handleCallMessage_(detail) {
    // The ID is used for when sending a response.
    var id = detail['id'];

    // The service name.
    var name = detail['name'];

    var response = {};
    response['id'] = id;

    if (this.services_.containsKey(name)) {
      response['type'] = ServiceType.CALL_RESPONSE;
      try {
        var fn = this.services_.get(name);
        var returnValue = fn.apply(null, detail['arguments']);
        if (returnValue instanceof Promise) {
          returnValue
          .then(function(returnValue) {
            response['returnValue'] = returnValue;
            this.port_.send(response);
          }, function(err) {
            response['type'] = ServiceType.CALL_RESPONSE_ERROR;
            response['name'] = err.name;
            response['message'] = err.message;
            this.port_.send(response);
          })
        } else {
          response['returnValue'] = returnValue;
          this.port_.send(response);
        }
      } catch (err) {
        response['type'] = ServiceType.CALL_RESPONSE_ERROR;
        response['name'] = err.name;
        response['message'] = err.message;
        this.port_.send(response);
      }
    } else {
      response['type'] = ServiceType.CALL_RESPONSE_ERROR;
      response['name'] = "Error";
      response['message'] = "Service with name (" + name + ") not found.";
      this.port_.send(response);
    }
  }

  /**
   * Attempts to handle the call response message.
   * @param {?Object} detail the detail.
   */
  handleCallResponseMessage_(detail) {
    var id = detail['id'];
    var returnValue = detail['returnValue'];
    var instance = this.serviceInstances_.get(id);

    instance.responseComplete = true;

    if (instance.async) {
      // Remove instance from map.
      this.serviceInstances_.remove(id);

      // Reject the promise.
      instance.promiseResolve(returnValue);
    } else {
      instance.returnValue = returnValue;
    }
  }

  /**
   * Attempts to handle the call response error message.
   * @param {?Object} detail the detail.
   */
  handleCallResponseErrorMessage_(detail) {
    var id = detail['id'];
    var errorName = detail['name'];
    var errorMessage = detail['message'];

    var err = new ServiceError(errorName, errorMessage);
    var instance = this.serviceInstances_.get(id);

    instance.responseComplete = true;

    if (instance.async) {
      // Remove instance from map.
      this.serviceInstances_.remove(id);

      // Reject the promise.
      instance.promiseReject(err);
    } else {
      instance.returnError = err;
    }
  }
}
