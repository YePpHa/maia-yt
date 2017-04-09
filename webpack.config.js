var path = require('path');

module.exports = {
  entry: {
    userscript: './src/userscript/index.js'
  },
  output: {
    filename: '[name].user.js',
    path: path.resolve(__dirname, 'dist')
  }
};
