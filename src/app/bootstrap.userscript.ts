import { injectJS } from '../libs/script';
import { App } from './App';

declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

const injectModule = require('../../webpack.inject.config.js') as string;

const app = new App();
app.enterDocument();

injectJS(injectModule);