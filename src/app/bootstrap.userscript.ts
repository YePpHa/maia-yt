import { injectJS } from '../libs/script';
import { App } from './App';
import * as i18n from 'i18next';

declare const PRODUCTION: boolean;

i18n.init({
  resources: require("i18next-resource-store-loader!../i18n/index.js")
});

const injectModule = require('../../webpack.inject.' + (PRODUCTION ? 'prod' : 'dev') + '.config.js') as string;

const app = new App();
app.enterDocument();

injectJS(injectModule);