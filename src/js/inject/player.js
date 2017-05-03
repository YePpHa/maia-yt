import { servicePort } from './port';

export function register() {
  servicePort.registerService("player#play", function() {
    var el = document.getElementById("movie_player");
    el['playVideo']();
  });

  servicePort.registerService("player#pause", function() {
    var el = document.getElementById("movie_player");
    el['pauseVideo']();
  });

  servicePort.registerService("player#getCurrentTime", function() {
    var el = document.getElementById("movie_player");
    return el['getCurrentTime']();
  });

  var el = document.getElementById("movie_player");
  el.addEventListener("onStateChange", function(state) {
    servicePort.call("player#onStateChange", state);
  }, false)
};

export function deregister() {
  servicePort.deregisterService("player#play");
  servicePort.deregisterService("player#pause");
  servicePort.deregisterService("player#getCurrentTime");
};
