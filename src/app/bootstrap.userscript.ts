import { injectJS } from './libs/script';
import { App } from './App';
//import * as i18n from 'i18next';
import { Storage } from './libs/storage/MechanismStorage';
import { GreaseMonkeyMechanism } from './libs/storage/mechanism/GreaseMonkeyMechanism';
import { LocalStorageMechanism } from './libs/storage/mechanism/LocalStorageMechanism';
import { EventHandler } from './libs/events/EventHandler';
import { Mechanism } from './libs/storage/mechanism/Mechanism';
import { Logger } from './libs/logging/Logger';
import { GreaseMonkey4Mechanism } from './libs/storage/mechanism/GreaseMonkey4Mechanism';
import { Settings } from "./settings";
import { InterfaceSymbol } from "ts-di-transformer/api";
import { container } from "../config/config";
import { IStorage } from "./libs/storage/models/IStorage";
const logger = new Logger("Bootstrap");

/*i18n.init({
  resources: require("i18next-resource-store-loader!../i18n/index.js")
});*/

const injectModule = require('../../config/userscript.inject.webpack.config.js') as string;

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
    container.bindToConstant(InterfaceSymbol<IStorage>(), new Storage(mechanism));

    const app = container.resolve(App);
    app.loadStorage();
    app.enterDocument();
  
    injectJS(injectModule);

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