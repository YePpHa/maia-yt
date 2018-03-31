const injectScriptElement = (element: HTMLScriptElement, onload?: Function) => {
  if (onload) {
    element.onload = () => onload();
    (element as any).onreadystatechange = () => {
      switch ((element as any).readyState) {
        case "loaded":
        case "complete":
        onload();
      }
    };
  }

  if (document.currentScript && document.currentScript.parentNode) {
    document.currentScript.parentNode.insertBefore(element, document.currentScript);
  } else if (document.body) {
    document.body.appendChild(element);
  } else if (document.head) {
    document.head.appendChild(element);
  } else if (document.documentElement) {
    document.documentElement.appendChild(element);
  } else {
    throw new Error("Couldn't append script element to document.");
  }
};

/**
 * Inject JavaScript into the DOM.
 * @param code the JavaScript to inject.
 * @return the element injected into page.
 */
export function injectJS(code: string): HTMLScriptElement {
  let el: HTMLScriptElement = document.createElement('script');
  el.setAttribute('type', 'text/javascript');
  el.appendChild(document.createTextNode(code));
  
  injectScriptElement(el);

  return el;
}

/**
 * Inject a method and run it with the args.
 * @param fn The method to inject.
 * @param args the arguments to be passed to the method.
 */
export function injectFunction(fn: Function, ...args: any[]): HTMLScriptElement {
  let strArgs: string = JSON.stringify(args);

  let code: string = '(' + fn.toString() + ').apply(this, ' + strArgs + ');';

  return injectJS(code);
}

/**
 * Inject JavaScript into the DOM.
 * @param file the JavaScript file to inject.
 * @return the element injected into page.
 */
export function injectJSFile(file: string): HTMLScriptElement {
  let el: HTMLScriptElement = document.createElement('script');
  el.setAttribute('type', 'text/javascript');
  injectScriptElement(el);
  el.setAttribute('src', file);

  return el;
}
