const path = require('path');
const merge = require('webpack-merge');
const common = require('./build/webpack.common.config.js');

const webpackConfig = merge(common, {
  devtool: 'inline-source-map'
});

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    client:{
      clearContext: false
    },
    files: [
      './src/**/*.spec.ts'
    ],
    preprocessors: {
      './src/**/*.spec.ts': ['webpack', 'sourcemap']
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
    reporters: ['progress', 'kjhtml'],
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