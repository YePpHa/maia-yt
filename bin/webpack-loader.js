"use strict";

const webpack = require('webpack');
const async = require('async');
const MemoryFS = require('memory-fs');
const path = require('path');

const threadPoolSize = process.env.UV_THREADPOOL_SIZE || 4;
const asyncWebpackJobQueue = async.queue((config, callback) => {
  const fs = new MemoryFS();
  const compiler = webpack(config);
  compiler.outputFileSystem = fs;
  compiler.run((err, stats) => {
    if (err) {
      callback(err);
      return;
    }
    const info = stats.toJson();
    if (stats.hasErrors()) {
      callback(info.errors);
      return;
    } else if (stats.hasErrors()) {
      console.warn(info.warnings);
    }

    const file = path.join(config.output.path, config.output.filename);
    callback(null, fs.readFileSync(file));
  });
}, threadPoolSize - 1);

/**
 * @this {LoaderContext}
 */
module.exports = function() {
  this.cacheable && this.cacheable();

  const callback = this.async();
  const isSync = typeof callback !== "function";

  const webpackConfiguration = require(this.resource);

  asyncWebpackJobQueue.push(webpackConfiguration, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, 'module.exports = ' + JSON.stringify(result.toString('utf-8')) + ';');
    }
  });
};