import { App } from './app';
import { PlayerFactory } from './playerfactory';
import Map from 'goog:goog.structs.Map';

var app = new App();
app.enterDocument();

var playerFactory = new PlayerFactory(app.getService());
playerFactory.enterDocument();

// Only do this at the end as this will happen synchronously.
app.connect();
