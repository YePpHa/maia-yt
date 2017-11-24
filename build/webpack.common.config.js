const path = require('path');

module.exports = {
  resolveLoader: {
    alias: {
      'webpack-loader': path.join(__dirname, 'bin/webpack-loader')
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
        loader: 'ts-loader'
      },
      { test: /webpack\..+\.config\.js$/, loader: 'webpack-loader' }
    ]
  }
};