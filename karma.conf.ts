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
    plugins: [
      'istanbul-instrumenter-loader',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-jasmine-html-reporter',
      'karma-sauce-launcher',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],
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
    customLaunchers: {
      'SL_Chrome': {
        base: 'SauceLabs',
        browserName: 'chrome'
      }
    },
    sauceLabs: {
      testName: 'Maia',
      retryLimit: 3,
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        'selenium-version': '2.53.0',
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400,
      }
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });

  if (process.env.TRAVIS) {
    var buildId =
        'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
    config.sauceLabs.build = buildId;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    config.browsers = Object.keys(config.customLaunchers);
    config.singleRun = true;
    config.reporters = config.reporters.concat(['saucelabs']);

    config.transports = ['polling'];
  }
}