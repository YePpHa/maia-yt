import { ServiceError } from './ServiceError';

export class ServiceInstance {
  /**
   * Whether the instance is async. This is checked after the request has been
   * sent.
   */
  public async: boolean = false;

  /**
   * If the instance is async a promise resolve will be set that can be called
   * when a response has been received.
   */
  public promiseResolve: Function;

  /**
   * If the instance is async a promise reject will be set that can be called
   * when a response has been received.
   */
  public promiseReject: Function;

  /**
   * The return value if async is false.
   */
  public returnValue: any;

  /**
   * The error if async is false.
   */
  public returnError: ServiceError;

  /**
   * Whether a response has been received.
   */
  public responseComplete: boolean = false;
}