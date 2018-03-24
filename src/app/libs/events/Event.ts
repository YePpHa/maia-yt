export class Event {
  public currentTarget: Object|undefined;
  public defaultPrevented: boolean = false;
  private _propagationStopped: boolean = false;
  private _returnValue: boolean = true;

  /**
   * A base class for event objects, so that they can support preventDefault and
   * stopPropagation.
   * @param type The event type.
   * @param target Reference to the object that is the target of this event. It
   *    has to implement the {@code EventTarget} interface declared at
   *    {@link http://developer.mozilla.org/en/DOM/EventTarget}.
   */
  constructor(
    public type: string,
    public target?: Object
  ) {
    this.currentTarget = this.target;
  }

  /**
   * Stops event propagation.
   */
  stopPropagation() {
    this._propagationStopped = true;
  }

  /**
   * Prevents the default action, for example a link redirecting to a url.
   */
  preventDefault() {
    this.defaultPrevented = true;
    this._returnValue = false;
  }

  /**
   * Returns whether the propagation has been stopped.
   */
  isPropagationStopped(): boolean {
    return this._propagationStopped;
  }

  isReturnValue(): boolean {
    return this._returnValue;
  }
}

export type EventLike = string|Object|Event;