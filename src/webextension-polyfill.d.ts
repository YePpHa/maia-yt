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

declare namespace browser.runtime {
  const lastError: Error;
  const id: string;
  function getBackgroundPage(): Promise<Window>;
  function openOptionsPage(): Promise<void>;
  function getManifest(): Object;
  function getURL(path: string): string;
  function setUninstallURL(url: string): Promise<void>;
  function reload(): void;
}

declare namespace browser.webNavigation {
  type ListenerType<T> = (detail: T) => void;
  
  interface IListener<T> {
    addListener(listener: ListenerType<T>): void;
    removeListener(listener: ListenerType<T>): void;
    hasListener(listener: ListenerType<T>): boolean;
  }

  interface INavigationDetails {
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    timeStamp: number;
  }

  const onCommitted: IListener<INavigationDetails>;
}

declare namespace browser.tabs {
  interface IScriptDetails {
    allFrames?: boolean;
    code?: string;
    file?: string;
    frameId?: number;
    matchAboutBlank?: boolean;
    runAt?: "document_start"|"document_end"|"document_idle";
  }

  function executeScript(tabId: number, details: IScriptDetails): Promise<Object>;
}

declare module 'webextension-polyfill' {
  export = browser;
}