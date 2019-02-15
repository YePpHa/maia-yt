import { injectJSFile } from './libs/script';
import { App } from './App';
//import * as i18n from 'i18next';
import { Storage } from './libs/storage/MechanismStorage';
import { LocalStorageMechanism } from './libs/storage/mechanism/LocalStorageMechanism';
import { EventHandler } from './libs/events/EventHandler';
import { Mechanism } from './libs/storage/mechanism/Mechanism';
import { Logger } from './libs/logging/Logger';
import { WebExtensionMechanism } from './libs/storage/mechanism/WebExtensionMechanism';
import * as browser from 'webextension-polyfill';
import { Settings } from "./settings";
import { container } from "../config/config";
import { InterfaceSymbol } from "ts-di-transformer/api";
import { IStorage } from "./libs/storage/models/IStorage";
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
    container.bindToConstant(InterfaceSymbol<IStorage>(), new Storage(mechanism));

    const app = container.resolve(App);
    app.loadStorage();
    app.enterDocument();
  
    injectJSFile(browser.runtime.getURL('inject.js'));

    const settingsBasePath = "/settings/maia";
  
    if (location.hostname === "www.youtube.com" && location.pathname.substring(0, settingsBasePath.length) === settingsBasePath) {
      let handler = new EventHandler();
      handler.listen(document, "readystatechange", () => {
        switch (document.readyState) {
          case "interactive":
          case "complete":
            handler.dispose();
            document.body.innerHTML = "";
            document.head.innerHTML = "";
            const settings = container.resolve(Settings);
            settings.render(settingsBasePath);
            break;
        }
      });
    }
  } else {
    logger.error("No storage mechanism was available.");
  }
};

run();