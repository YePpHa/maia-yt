const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const interfaceTransformer = require('ts-di-transformer/transformer').default;

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
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    forceAllTransforms: true
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              transpileOnly: false,
              getCustomTransformers: program => ({
                before: [
                  interfaceTransformer(program)
                ]
              })
            }
          }
        ]
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
  config.plugins.unshift(new UglifyJsPlugin());
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
