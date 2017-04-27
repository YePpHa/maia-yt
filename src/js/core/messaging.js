import PortChannel from 'goog:goog.messaging.PortChannel';

export var channel = PortChannel.forEmbeddedWindow(window, '*');

channel.connect(function() {
  console.log("Core connected.");
});
