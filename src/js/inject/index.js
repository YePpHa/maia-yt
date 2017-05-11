import { App } from './app';
import { PlayerFactory } from './playerfactory';
import Map from 'goog:goog.structs.Map';
import { wrapFunction } from '../utils/observer';

var app = new App();
app.enterDocument();

var playerFactory = new PlayerFactory(app.getService());
playerFactory.enterDocument();

// Hijack the yt.player.Application.create() method.
window['yt'] = window['yt'] || {};
wrapFunction(window['yt'], ['player', 'Application', 'create'],
  function(fn, self, args) {
    var player = fn.apply(self, args);

    // Just log the result of create();
    console.log("yt.player.Application.create()", player, args);

    return player;
  }
);

// Only do this at the end as this will happen synchronously.
app.connect();
