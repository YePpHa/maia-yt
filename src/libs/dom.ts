import { EventHandler } from './events/EventHandler';
import { BrowserEvent } from './events/BrowserEvent';

declare interface _CustomEvent extends Event {
  detail: any;
}

// Checking how to construct the CustomEvent.
let supportConstructor = false;
try {
  let eventType: string = '__maiaCustomEventSupport';
  let eventPayload = 'payload_value';
  let evt = new CustomEvent(eventType, { 'detail': eventPayload });

  // Creating the element to dispatch the event to.
  let el = document.createElement("div");
  let handler: EventHandler = new EventHandler();

  handler.listen(el, eventType, function(e: BrowserEvent) {
    let browserEvent: CustomEvent = e.getBrowserEvent() as CustomEvent;
    let payload = browserEvent.detail;

    supportConstructor = payload === eventPayload;

    handler.dispose();
  }, false);
  el.dispatchEvent(evt);
  handler.dispose();
} catch (e) {}

/**
 * Returns the custom event.
 * @param type the type of the event.
 * @param payload the payload of the custom event.
 */
export function createCustomEvent(type: string, payload: string): CustomEvent {
  if (supportConstructor) {
    return new CustomEvent(type, { 'detail': payload });
  } else {
    let evt: _CustomEvent = document.createEvent('Event') as _CustomEvent;
    evt.detail = payload;

    evt.initEvent(type, true, true);

    return evt as CustomEvent;
  }
}
