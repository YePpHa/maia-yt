var _ = require('lodash'),
    path = require('path'),
    chokidar = require('chokidar'),
    Promise = require('bluebird'),
    cache = {},
    glob = Promise.promisify(require('glob')),
    readFile = Promise.promisify(require('graceful-fs').readFile),
    provideRegExp = /goog\.provide\((['"])(([^.)]+)[^)]*)\1\)/g;

/**
 * Fulfills in an object wich maps namespaces to file paths found in given
 * directories.
 *
 * @param {string[]} directories Directories to be processed
 * @param {boolean} watch Watch for changes is mapped files to invalidate cache
 * @returns {Promise}
 */
module.exports = function (directories, watch) {
    return Promise.map(directories, function(dir) {
        return resolveAndCacheDirectory(dir, watch)
    }).then(function(results) {
        return _.assign.apply(_, results);
    })
};

/**
 * Promisified watch
 *
 * Resolves promise after watcher is ready to prevent `add` events during
 * initializations wich repeatedly deletes our cache.
 *
 * @returns {Promise}
 */
function createWatchPromise(directory) {
    return new Promise(function(resolve, reject) {
        var watcher = chokidar.watch(directory)
            .on('ready', function() {
                watcher.on('all', function() {
                    delete cache[directory];
                });
                resolve(watcher);
            });
    });
}

/**
 * Fulfills in an object wich maps namespace to file path. The result will be
 * cached by the given directory name. A file watcher watches for any changes
 * in this directory and deletes the cached object.
 *
 * @param {string} directory
 * @returns {Promise}
 */
function resolveAndCacheDirectory(directory, watch) {

    if (cache[directory]) {
        return cache[directory];
    }

    cache[directory] = (watch ? createWatchPromise(directory) : Promise.resolve())
        .then(function() {
            return glob(path.join(directory, '/**/*.js'));
        })
        .map(function(filePath) {
            return findProvideCalls(filePath);
        })
        .then(function(results) {
            return _.assign.apply(_, results);
        });

    return cache[directory];
}

/**
 * Scans the given file path for occurences of `goog.provide()` and fulfills
 * in an object wich mapps each namespace to the file path
 *
 * @param {string} filePath
 * @returns {Promise}
 */
function findProvideCalls(filePath) {
    return readFile(filePath).then(function(fileContent) {
        var result = {};
        while (matches = provideRegExp.exec(fileContent)) {
            result[matches[2]] = filePath;
        }
        return result;
    });
}