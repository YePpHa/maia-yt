const package = require('../package.json');
const { parseAuthor } = require('./utils');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

const generateManifestContent = () => {
  const manifest = {
    "name": package['name'],
    "description": package['description'],
    "version": package['version'],
    "author": parseAuthor(package['author']),
    "manifest_version": 2,
    "background": {
      "scripts": [ "background.js" ]
    },
    "permissions": [
      "webNavigation",
      "https://www.youtube.com/*"
    ],
    "web_accessible_resources": [ "inject.js" ]
  };

  return JSON.stringify(manifest, null, 2);
};

const dist = path.join(__dirname, '../dist/webextension');

mkdirp(dist, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  const data = generateManifestContent();

  fs.writeFile(path.join(dist, 'manifest.json'), data, (err) => {
    if (err) console.error(err);
  })
});