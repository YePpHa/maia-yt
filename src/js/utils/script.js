import dom from 'goog:goog.dom';
import TagName from 'goog:goog.dom.TagName';
import asserts from 'goog:goog.asserts';

/**
 * Inject JavaScript into the DOM.
 * @param {?string} code the JavaScript to inject.
 * @return {!Element} the element injected into page.
 */
export function injectJS(code) {
  asserts.assert(!!document, "Document is not defined.");

  var el = dom.createDom(TagName.SCRIPT, {
    "type": "text/javascript"
  }, code);

  if (document.body) {
    document.body.appendChild(el);
  } else if (document.head) {
    document.head.appendChild(el);
  } else if (document.documentElement) {
    document.documentElement.appendChild(el);
  } else {
    throw new Error("Couldn't append script element to document.");
  }

  return el;
}

/**
 * Inject JavaScript into the DOM.
 * @param {?string} file the JavaScript file to inject.
 * @return {!Element} the element injected into page.
 */
export function injectJSFile(file) {
  asserts.assert(!!document, "Document is not defined.");

  var el = dom.createDom(TagName.SCRIPT, {
    "type": "text/javascript",
    "src": file
  });

  if (document.body) {
    document.body.appendChild(el);
  } else if (document.head) {
    document.head.appendChild(el);
  } else if (document.documentElement) {
    document.documentElement.appendChild(el);
  } else {
    throw new Error("Couldn't append script element to document.");
  }

  return el;
}
