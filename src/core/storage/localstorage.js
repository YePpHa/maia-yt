import Storage from './storage';
import {serialize, deserialize} from '../json';

export default class LocalStorage extends Storage {
  constructor() {
    super();
  }

  key(index) {
    return localStorage.key(index);
  }

  getItem(key) {
    return deserialize(localStorage.getItem(key));
  }

  setItem(key, value) {
    localStorage.setItem(key, serialize(value));
  }

  removeItem(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  get length() {
    return localStorage.length;
  }
}
