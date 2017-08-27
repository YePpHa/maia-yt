const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    index: './src/app/bootstrap.inject.ts'
  },
  output: {
    filename: 'inject.js',
    path: path.resolve(__dirname, 'dist')
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
      }
    ]
  }
};