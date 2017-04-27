import EventHandler from 'goog:goog.events.EventHandler';

var supportConstructor = false;
/** @preserveTry */
try {
  let eventType = '__maiaCustomEventSupport';
  let eventPayload = 'payload_value';
  let evt = new CustomEvent(eventType, { 'detail': eventPayload });

  // Creating the element to dispatch the event to.
  var el = document.createElement("div");
  var handler = new EventHandler();

  handler.listen(el, eventType, function(e) {
    var browserEvent = e.getBrowserEvent();
    var payload = browserEvent['detail'];

    supportConstructor = payload === eventPayload;

    handler.dispose();
  }, false);
  el.dispatchEvent(evt);
} catch (e) {}

/**
 * Returns a custom event.
 * @param {!string} type the event type.
 * @param {?string} payload the payload.
 * @return {!CustomEvent} the custom event.
 */
export function createCustomEvent(type, payload) {
  if (supportConstructor) {
    return new CustomEvent(type, { 'detail': payload });
  } else {
    var evt = document.createEvent('Event');
    evt['detail'] = payload;

    evt.initEvent(type, true, true);

    return /** @type {!CustomEvent} */ (evt);
  }
}
