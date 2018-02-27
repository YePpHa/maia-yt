import "reflect-metadata";
import { injectJSFile } from './libs/script';
import { App } from './App';
//import * as i18n from 'i18next';
import { Storage } from './libs/storage/Storage';
import { LocalStorageMechanism } from './libs/storage/mechanism/LocalStorageMechanism';
import { EventHandler } from './libs/events/EventHandler';
import { render as renderSettings } from './ui';
import { Mechanism } from './libs/storage/mechanism/Mechanism';
import { Logger } from './libs/logging/Logger';
import { WebExtensionMechanism } from './libs/storage/mechanism/WebExtensionMechanism';
import * as browser from 'webextension-polyfill';
import container from "./inversify.config";
import { ApiStorageToken } from "./components/ApiStorage";
const logger = new Logger("Bootstrap");

/*i18n.init({
  resources: require("i18next-resource-store-loader!../i18n/index.js")
});*/

const run = async () => {
  let mechanism: Mechanism|undefined;
  
  const webExtensionMechanism = new WebExtensionMechanism();
  const localStorageMechanism = new LocalStorageMechanism();
  if (await webExtensionMechanism.isAvailable()) {
    logger.debug("Using WebExtension storage mechanism");
    mechanism = webExtensionMechanism;
  } else if (await localStorageMechanism.isAvailable()) {
    logger.debug("Using LocalStorage storage mechanism");
    mechanism = localStorageMechanism;
  }
  
  if (mechanism) {
    container.bind<Storage>(ApiStorageToken).toConstantValue(new Storage(mechanism));

    const app = container.get<App>(App);
    app.loadStorage();
    app.enterDocument();
  
    injectJSFile(browser.runtime.getURL('inject.js'));
  
    if (location.hostname === "www.youtube.com" && location.pathname === "/settings/maia") {
      let handler = new EventHandler();
      handler.listen(document, "readystatechange", () => {
        switch (document.readyState) {
          case "interactive":
          case "complete":
            handler.dispose();
            document.body.innerHTML = "";
            document.head.innerHTML = "";
            renderSettings(app.getComponents());
            break;
        }
      });
    }
  } else {
    logger.error("No storage mechanism was available.");
  }
};

run();