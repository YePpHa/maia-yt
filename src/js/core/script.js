import dom from 'goog:goog.dom';
import TagName from 'goog:goog.dom.TagName';

/**
 * Inject JavaScript into the DOM.
 * @param {?string} code the JavaScript to inject.
 */
export function injectJS(code) {
  var el = dom.createDom(TagName.SCRIPT, {
    "type": "text/javascript",
    "async": true
  }, code);

  if (!document) throw new Error("Document is not defined.");
  if (document.body) {
    document.body.appendChild(el);
  } else if (document.head) {
    document.head.appendChild(el);
  } else if (document.documentElement) {
    document.documentElement.appendChild(el);
  } else {
    throw new Error("Couldn't append script element to document.");
  }
}
