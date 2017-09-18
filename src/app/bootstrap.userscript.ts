import { injectJS } from '../libs/script';
import { App } from './App';
import * as i18n from 'i18next';
import { Storage } from '../libs/storage/Storage';
import { GreaseMonkeyMechanism } from '../libs/storage/mechanism/GreaseMonkeyMechanism';
import { EventHandler } from '../libs/events/EventHandler';
import { render as renderSettings } from './settings';

declare const PRODUCTION: boolean;

i18n.init({
  resources: require("i18next-resource-store-loader!../i18n/index.js")
});

const injectModule = require('../../webpack.inject.' + (PRODUCTION ? 'prod' : 'dev') + '.config.js') as string;

const app = new App(new Storage(new GreaseMonkeyMechanism()));
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