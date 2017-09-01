const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.userscript.config.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'PRODUCTION': JSON.stringify(false)
    })
  ]
});