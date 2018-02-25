const path = require('path');
const config = require('./webpack.inject.config.js');

config.output.path = path.join(config.output.path, 'webextension');

module.exports = config;