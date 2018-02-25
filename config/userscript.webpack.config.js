const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');
const merge = require('webpack-merge');
const package = require('../package.json');
const common = require('./webpack.common.config.js');
const { parseAuthor } = require('../build/utils');

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

const metadata = {
  'name': package['name'],
  'namespace': 'https://github.com/YePpHa',
  'description': package['description'],
  'version': package['version'],
  'author': parseAuthor(package['author']),
  'match': 'https://www.youtube.com/*',
  'source': package['repository']['url'],
  'grant': [
    'GM_setValue',
    'GM_getValue',
    'GM_deleteValue',
    'GM.setValue',
    'GM.getValue',
    'GM.deleteValue'
  ],
  'noframes': undefined,
  'run-at': 'document-start'
};

const config = merge(common, {
  entry: {
    index: './src/app/bootstrap.userscript.ts'
  },
  output: {
    filename: 'maia.user.js',
    path: path.resolve(__dirname, '../dist')
  },
  plugins: [
    new WrapperPlugin({
      test: /\.js$/,
      header: generateMetadataBlock(metadata)
    })
  ]
});

module.exports = config;