import { App } from './app';
import { PlayerFactory, handlePlayerCreate } from './playerfactory';
import { wrapFunction } from '../utils/observer';

var app = new App();
app.enterDocument();

var playerFactory = new PlayerFactory(app.getService());
playerFactory.enterDocument();

// Only do this at the end as this will happen synchronously.
app.connect();

// If the player has already been created add it.
if (window['ytplayer'] && window['ytplayer']['config']
  && window['ytplayer']['config']['loaded']) {
  let playerConfig = window['ytplayer']['config'];

  handlePlayerCreate(app.getService(), playerFactory, playerConfig);
}

// Hijack the yt.player.Application.create() method.
window['yt'] = window['yt'] || {};

wrapFunction(window['yt'], ['player', 'Application', 'create'],
  function(fn, self, args) {
    var playerConfig = /** @type {!Object} */ (args[1]);
    return handlePlayerCreate(app.getService(), playerFactory, playerConfig,
        fn.bind(self, args[0]));
  }
);
