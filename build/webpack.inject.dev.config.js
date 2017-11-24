const merge = require('webpack-merge');
const common = require('./webpack.inject.config.js');

module.exports = merge(common, {
  devtool: 'inline-source-map'
});