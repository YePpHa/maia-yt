/**
 * Wrap a function inside a wrapper function that's predefined. If the function
 * is not yet set inside the parent it will be done when it's set.
 * @param {!Object} parent the parent.
 * @param {!string|!Array<string>} property the property in dot notation.
 * @param {!Function} wrapperFn the wrapper function.
 * @param {Object=} opt_obj optional this object.
 */
export function wrapFunction(parent, property, wrapperFn, opt_obj) {
  var properties = null;
  if (goog.isArray(property)) {
    properties = property;
  } else if (goog.isString(property)) {
    properties = property.split(".");
  } else {
    throw new Error("Property is invalid.");
  }

  if (properties.length === 0) throw new Error("No properties in parent.");

  var next = () => {
    var property = properties.shift();

    if (properties.length === 0 || !parent[property]) {
      // The value of the property.
      var value = parent[property];

      // Whether the property is the function to wrap.
      var isWrappedProperty = properties.length === 0;

      var valueWrapper = null;
      if (isWrappedProperty) {
        valueWrapper = function() {
          var args = Array.prototype.slice.call(arguments, 0);
          var self = this;

          return wrapperFn.call(opt_obj,
            /** @type {!Function} */ (value),
            /** @type {?Object} */ (self),
            /** @type {!Array} */ (args));
        };
      }

      // If it's the wrapped function then it's already defined.
      var defined = isWrappedProperty;
      Object.defineProperty(parent, property, {
        "set": val => {
          value = val;
          if (!defined) {
            defined = true;
            parent = parent[property];
            next();
          }
        },
        "get": () => {
          if (valueWrapper) {
            return valueWrapper;
          }
          return value;
        }
      });
    } else {
      parent = parent[property];
      next();
    }
  };

  next();
}
