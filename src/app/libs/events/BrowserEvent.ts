import { Event as MyEvent } from './Event';
import { MouseButton } from './MouseButton';
import { isMac } from '../platform/navigator';

declare interface _KeyboardEvent extends Event {
  keyCode: number;
  ctrlKey: boolean;
}

export class BrowserEvent extends MyEvent {
  public relatedTarget: EventTarget|null = null;
  public offsetX = 0;
  public offsetY = 0;
  public clientX = 0;
  public clientY = 0;
  public screenX = 0;
  public screenY = 0;
  public button: MouseButton = MouseButton.Left;
  public key = "";
  public keyCode = 0;
  public charCode = 0;
  public ctrlKey = false;
  public altKey = false;
  public shiftKey = false;
  public metaKey = false;
  public state: Object|null = null;
  public platformModifierKey = false;
  public detail: any = undefined;

  private _event: Event;

  constructor(event?: Event, currentTarget?: EventTarget) {
    super(event ? event.type : '');

    this._event = event || new Event(this.type);

    this.init(this._event, currentTarget);
  }

  init(event: Event, currentTarget?: EventTarget) {
    const type = this.type = event.type;
  
    /**
     * On touch devices use the first "changed touch" as the relevant touch.
     */
    const touchEvent = event as TouchEvent;
    const relevantTouch: Touch|undefined = (touchEvent.changedTouches ? touchEvent.changedTouches[0] : undefined);
    
    this.target = event.target || event.srcElement || undefined;
  
    this.currentTarget = currentTarget;
  
    const mouseEvent = event as MouseEvent;
    const relatedTarget = mouseEvent.relatedTarget;
  
    this.relatedTarget = relatedTarget;
  
    if (!!relevantTouch) {
      this.clientX = relevantTouch.clientX !== undefined ? relevantTouch.clientX :
                                                            relevantTouch.pageX;
      this.clientY = relevantTouch.clientY !== undefined ? relevantTouch.clientY :
                                                            relevantTouch.pageY;
      this.screenX = relevantTouch.screenX || 0;
      this.screenY = relevantTouch.screenY || 0;
    } else {
      this.offsetX = mouseEvent.offsetX;
      this.offsetY = mouseEvent.offsetY;
      this.clientX = mouseEvent.clientX !== undefined ? mouseEvent.clientX : mouseEvent.pageX;
      this.clientY = mouseEvent.clientY !== undefined ? mouseEvent.clientY : mouseEvent.pageY;
      this.screenX = mouseEvent.screenX || 0;
      this.screenY = mouseEvent.screenY || 0;
    }
  
    this.button = mouseEvent.button;
  
    const keyEvent = event as KeyboardEvent;
    this.keyCode = keyEvent.keyCode || 0;
    this.key = keyEvent.key || '';
    this.charCode = keyEvent.charCode || (type === 'keypress' ? keyEvent.keyCode : 0);
    this.ctrlKey = keyEvent.ctrlKey;
    this.altKey = keyEvent.altKey;
    this.shiftKey = keyEvent.shiftKey;
    this.metaKey = keyEvent.metaKey;
    this.platformModifierKey = isMac ? keyEvent.metaKey : keyEvent.ctrlKey;

    const popStateEvent = event as PopStateEvent;
    this.state = popStateEvent.state;

    const customEvent = event as CustomEvent;
    this.detail = customEvent.detail;

    this._event = event;
    if (event.defaultPrevented) {
      this.preventDefault();
    }
  }
  
  stopPropagation() {
    super.stopPropagation();

    if (this._event.stopPropagation) {
      this._event.stopPropagation();
    } else {
      this._event.cancelBubble = true;
    }
  }
  
  preventDefault() {
    super.preventDefault();

    if (!this._event.preventDefault) {
      this._event.returnValue = false;
      try {
        // Most keys can be prevented using returnValue. Some special keys
        // require setting the keyCode to -1 as well:
        //
        // In IE7:
        // F3, F5, F10, F11, Ctrl+P, Crtl+O, Ctrl+F (these are taken from IE6)
        //
        // In IE8:
        // Ctrl+P, Crtl+O, Ctrl+F (F1-F12 cannot be stopped through the event)
        //
        // We therefore do this for all function keys as well as when Ctrl key
        // is pressed.
        const VK_F1 = 112;
        const VK_F12 = 123;
        const keyEvent = this._event as _KeyboardEvent;
        if (keyEvent.ctrlKey || keyEvent.keyCode >= VK_F1 && keyEvent.keyCode <= VK_F12) {
          keyEvent.keyCode = -1;
        }
      } catch (ex) {
        // IE throws an 'access denied' exception when trying to change
        // keyCode in some situations (e.g. srcElement is input[type=file],
        // or srcElement is an anchor tag rewritten by parent's innerHTML).
        // Do nothing in this case.
      }
    } else {
      this._event.preventDefault();
    }
  }

  getBrowserEvent(): Event {
    return this._event;
  }
}