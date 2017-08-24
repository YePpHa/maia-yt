export class ServiceError extends Error {
  /**
   * @param {!string} name the name of the error.
   * @param {?string} message the message of the error.
   */
  constructor(name: string, message: string) {
    super(message);
    this.name = name;

    this.stack = (new Error(message)).stack;
  }
}