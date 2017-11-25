declare namespace browser.storage {
  export const sync: StorageArea;
  export const local: StorageArea;
  
  export class StorageArea {
    get(keys: string|string[]|null|{[key: string]: any}): Promise<any>;
    set(keys: {[key: string]: any}): Promise<void>;
    remove(keys: string|string[]): Promise<void>;
    clear(): Promise<void>;
    getBytesInUse(keys: null|string|string[]): Promise<number>;
  }
}

declare module 'webextension-polyfill' {
  export = browser;
}