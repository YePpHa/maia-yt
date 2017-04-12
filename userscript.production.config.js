var path = require('path')
  , webpack = require('webpack')
  , ClosureCompiler = require('./bin/closure-compiler');

module.exports = {
  entry: {
    userscript: './src/userscript/index.js'
  },
  output: {
    filename: '[name].user.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      'goog': path.join(__dirname, 'node_modules', 'google-closure-library', 'closure', 'goog'),
      'npm': path.join(__dirname, 'node_modules')
    }
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, 'node_modules', 'google-closure-library', 'closure', 'goog'),
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'bin')
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      goog: 'goog/base'
    }),
    new ClosureCompiler({
      options: {
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'ADVANCED',
        warningLevel: 'VERBOSE'
      }
    })
  ]
};
