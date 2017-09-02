const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');
const package = require('./package.json');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

/**
 * Generate the user
 * @param {{[key: string]: string|string[]|undefined|null}} metadata the metadata.
 * @return {string} the metadata block as a string.
 */
const generateMetadataBlock = (metadata) => {
  let block = '';
  for (let key in metadata) {
    if (metadata.hasOwnProperty(key)) {
      let values = metadata[key];
      if (values) {
        if (!Array.isArray(values)) {
          values = [values];
        }
        for (let i = 0; i < values.length; i++) {
          block += '// @' + key + ' ' + values[i] + '\n';
        }
      } else {
        block += '// @' + key + '\n';
      }
    }
  }

  return '// ==UserScript==\n'
    + block
    + '// ==/UserScript==\n\n';
};

/**
 * Parse the author into a string.
 * @param {{name: string, email: string, url: string}|string} author  the author
 * @return {string} the author.
 */
const parseAuthor = (author) => {
  if (typeof author === 'string') return author;

  let a = author['name'];
  if (author['email']) {
    a += ' <' + author['email'] + '>';
  }
  if (author['url']) {
    a += ' (' + author['url'] + ')';
  }

  return a;
};

const metadata = {
  'name': package['name'],
  'description': package['description'],
  'version': package['version'],
  'author': parseAuthor(package['author']),
  'match': 'https://www.youtube.com/*',
  'source': package['repository']['url'],
  'grant': [
    'GM_setValue',
    'GM_getValue',
    'GM_deleteValue'
  ],
  'noframes': undefined,
  'run-at': 'document-start'
};

module.exports = merge(common, {
  entry: {
    index: './src/app/bootstrap.userscript.ts'
  },
  output: {
    filename: 'maia.user.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new WrapperPlugin({
      test: /\.js$/,
      header: generateMetadataBlock(metadata)
    })
  ]
});