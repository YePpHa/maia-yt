const path = require('path');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-webpack'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-sourcemap-loader')
    ],
    client:{
      clearContext: false
    },
    files: [
      { pattern: './src/**/*.spec.ts', watched: true }
    ],
    preprocessors: {
      './src/**/*.spec.ts': ['webpack', 'sourcemap']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    webpack: {
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: { loader: 'istanbul-instrumenter-loader' },
            include: path.resolve('./src')
          }
        ]
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      }
    },
    coverageIstanbulReporter: {
      reports: ['text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
}