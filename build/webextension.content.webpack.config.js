const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');
const merge = require('webpack-merge');
const package = require('../package.json');
const common = require('./webpack.common.config.js');

const config = merge(common, {
  entry: {
    index: './src/app/bootstrap.webextension.ts'
  },
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, '../dist/webextension')
  }
});

module.exports = config;