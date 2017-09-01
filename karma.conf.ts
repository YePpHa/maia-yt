const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

const webpackConfig = merge(common, {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, './src')
        ],
        exclude: path.resolve(__dirname, './src/test.js'),
        use: {
          loader: 'istanbul-instrumenter-loader',
          query: {
            esModules: true
          }
        }
      }
    ]
  },
});

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    client:{
      clearContext: false
    },
    files: [
      { pattern: './src/test.js', watched: true }
    ],
    preprocessors: {
      './src/test.js': ['webpack', 'sourcemap']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    },
    webpackMiddleware: {
      stats: 'errors-only'
    },
    coverageReporter: {
      dir: 'coverage',
      type: 'html'
    },
    coverageIstanbulReporter: {
      reports: [ 'text-summary' ],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
}