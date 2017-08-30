import { injectJS } from '../libs/script';
import { App } from './App';
import * as i18n from 'i18next';

i18n.init({
  resources: require("i18next-resource-store-loader!../i18n/index.js")
});

const injectModule = require('../../webpack.inject.config.js') as string;

const app = new App();
app.enterDocument();

injectJS(injectModule);