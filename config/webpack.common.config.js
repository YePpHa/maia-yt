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
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: false
          }
        }
      },
      { test: /webpack\..+\.config\.js$/, use: 'webpack-loader' },
      {
        test: /\.scss$/,
        use: [
          'style-loader/useable',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader/useable',
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          }
        ]
      }
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
