const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const config = {
  resolveLoader: {
    alias: {
      'webpack-loader': path.join(__dirname, '../bin/webpack-loader')
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: production
        }
      },
      { test: /webpack\..+\.config\.js$/, loader: 'webpack-loader' }
    ]
  },
  plugins: []
};

if (production) {
  config.plugins.unshift(new UglifyJSPlugin());
} else {
  config.devtool = 'inline-source-map';
}
config.plugins.unshift(
  new webpack.DefinePlugin({
    'PRODUCTION': JSON.stringify(production),
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  })
);

module.exports = config;
