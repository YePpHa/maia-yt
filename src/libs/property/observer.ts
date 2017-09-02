/**
 * Wrap a function inside a wrapper function that's predefined. If the function
 * is not yet set inside the parent it will be done when it's set.
 * @param parent the parent.
 * @param property the property in dot notation.
 * @param wrapperFn the wrapper function.
 * @param scope optional this object.
 * @return a function that removes the value descriptors
 */
export function wrapFunction<T>(parent: any, property: string|string[], wrapperFn: ((this: T, value: any, scope: any, args: any[], otherValues: any[]) => any), scope?: T, onlyFirstValue: boolean = false): Function {
  let properties: string[];
  if (Array.isArray(property)) {
    properties = property;
  } else {
    properties = property.split(".");
  }

  if (properties.length === 0) throw new Error("No properties in parent.");
  let lastProperty: string;
  let lastValue: any;

  const next = () => {
    let property = properties.shift() as string;
    lastProperty = property;

    if (properties.length === 0 || !parent[property]) {
      // The value of the property.
      let value: any = parent[property];
      let otherValues: any[] = [];
      lastValue = value;

      // Whether the property is the function to wrap.
      const isWrappedProperty = properties.length === 0;

      let valueWrapper: Function;
      if (isWrappedProperty) {
        valueWrapper = function(this: any, ...args: any[]) {
          return wrapperFn.call(scope, value, this, args, otherValues);
        };
      }

      // If it's the wrapped function then it's already defined.
      let defined = isWrappedProperty;
      Object.defineProperty(parent, property, {
        "set": val => {
          if (!isWrappedProperty || !onlyFirstValue) {
            value = val;
          } else if (typeof value !== "function") {
            value = val;
          } else {
            otherValues.push(val);
          }
          
          if (!defined) {
            Object.defineProperty(parent, property, {
              "value": value,
              "configurable": true,
              "enumerable": true,
              "writable": true
            });

            defined = true;
            parent = parent[property as string];
            next();
          }
        },
        "get": () => {
          if (valueWrapper) {
            return valueWrapper;
          }
          return value;
        },
        "enumerable": true,
        "configurable": true
      });
    } else {
      parent = parent[property];
      next();
    }
  };

  next();

  return () => {
    Object.defineProperty(parent, lastProperty, {
      "value": lastValue,
      "configurable": true,
      "enumerable": true,
      "writable": true
    });
  };
}