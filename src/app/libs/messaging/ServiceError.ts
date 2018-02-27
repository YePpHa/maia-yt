export class ServiceError extends Error {
  /**
   * @param name the name of the error.
   * @param message the message of the error.
   * @param stack the stack trace of the error.
   */
  constructor(name: string, message: string, stack?: string) {
    super(message);
    this.name = name;

    this.stack = stack || (new Error(message)).stack;
  }
}