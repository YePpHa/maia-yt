var path = require('path');
var webpack = require('webpack');

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
  module: {
    rules: [
      {
        test: /closure\/goog\/base/,
        use: [
          'imports-loader?this=>{goog:{}}&goog=>this.goog',
          'exports-loader?goog'
        ]
      }, {
        test: /(third_party\/)?closure\/goog\/.*\.js/,
        use: [
          {
            loader: 'closure-loader',
            options: {
              paths: [
                __dirname + '/node_modules/google-closure-library/closure/goog',
                __dirname + '/node_modules/google-closure-library/third_party/closure/goog',
              ],
              es6mode: true,
              watch: false,
            }
          }

        ],
        exclude: [/closure\/goog\/base\.js$/]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      goog: 'goog/base'
    })
  ]
};
