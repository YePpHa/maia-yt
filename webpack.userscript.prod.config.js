const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.userscript.config.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const plugins = common.plugins;

common.plugins = [];

module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      'PRODUCTION': JSON.stringify(true),
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new UglifyJSPlugin(),
    ...plugins
  ]
});