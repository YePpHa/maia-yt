/**
 * Serialize object.
 * @param {?Object} obj the object to serialize.
 * @return {?string} the serialized object.
 */
export function serialize(obj) {
  return JSON.stringify(obj);
}

/**
 * Deserialize the serialized object.
 * @param {?string} serializedObject the serialized object.
 * @return {?Object} the deserialized object.
 */
export function deserialize(serializedObject) {
  return JSON.parse(serializedObject);
}
