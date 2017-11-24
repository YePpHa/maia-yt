import { injectJS } from '../libs/script';
import { App } from './App';
import * as i18n from 'i18next';
import { Storage } from '../libs/storage/Storage';
import { GreaseMonkeyMechanism } from '../libs/storage/mechanism/GreaseMonkeyMechanism';
import { LocalStorageMechanism } from '../libs/storage/mechanism/LocalStorageMechanism';
import { EventHandler } from '../libs/events/EventHandler';
import { render as renderSettings } from './settings';
import { Mechanism } from '../libs/storage/mechanism/Mechanism';
import { Logger } from '../libs/logging/Logger';
const logger = new Logger("Bootstrap");

declare const PRODUCTION: boolean;

i18n.init({
  resources: require("i18next-resource-store-loader!../i18n/index.js")
});

const injectModule = require('../../build/webpack.inject.config.js') as string;

let mechanism: Mechanism|undefined;

const greaseMonkeyMechanism = new GreaseMonkeyMechanism();
if (greaseMonkeyMechanism.isAvailable()) {
  logger.debug("Using GreaseMonkey storage mechanism");
  mechanism = greaseMonkeyMechanism;
} else {
  const localStorageMechanism = new LocalStorageMechanism();
  if (localStorageMechanism.isAvailable()) {
    logger.debug("Using LocalStorage storage mechanism");
    mechanism = localStorageMechanism;
  }
}

if (mechanism) {
  const storage = new Storage(mechanism);

  const app = new App(storage);
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
          renderSettings(app.getModules());
          break;
      }
    });
  }
} else {
  logger.error("No storage mechanism was available.");
}