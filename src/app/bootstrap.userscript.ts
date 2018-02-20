import { injectJS } from '../libs/script';
import { App } from './App';
//import * as i18n from 'i18next';
import { Storage } from '../libs/storage/Storage';
import { GreaseMonkeyMechanism } from '../libs/storage/mechanism/GreaseMonkeyMechanism';
import { LocalStorageMechanism } from '../libs/storage/mechanism/LocalStorageMechanism';
import { EventHandler } from '../libs/events/EventHandler';
import { render as renderSettings } from './settings';
import { Mechanism } from '../libs/storage/mechanism/Mechanism';
import { Logger } from '../libs/logging/Logger';
import { GreaseMonkey4Mechanism } from '../libs/storage/mechanism/GreaseMonkey4Mechanism';
const logger = new Logger("Bootstrap");

/*i18n.init({
  resources: require("i18next-resource-store-loader!../i18n/index.js")
});*/

const injectModule = require('../../build/userscript.inject.webpack.config.js') as string;

const run = async () => {
  let mechanism: Mechanism|undefined;
  
  const greaseMonkeyMechanism = new GreaseMonkeyMechanism();
  const greaseMonkey4Mechanism = new GreaseMonkey4Mechanism();
  const localStorageMechanism = new LocalStorageMechanism();
  if (await greaseMonkeyMechanism.isAvailable()) {
    logger.debug("Using GreaseMonkey storage mechanism");
    mechanism = greaseMonkeyMechanism;
  } else if (await greaseMonkey4Mechanism.isAvailable()) {
    logger.debug("Using GreaseMonkey4 storage mechanism");
    mechanism = greaseMonkey4Mechanism;
  } else if (await localStorageMechanism.isAvailable()) {
    logger.debug("Using LocalStorage storage mechanism");
    mechanism = localStorageMechanism;
  }
  
  if (mechanism) {
    const storage = new Storage(mechanism);
  
    const app = new App(storage);
    app.loadStorage();
    app.enterDocument();
  
    injectJS(injectModule);
  
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