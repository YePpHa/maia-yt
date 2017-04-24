var gulp = require('gulp')
  , closureGulp = require('./bin/build-gulp').closureCompiler
  , fs = require('fs')
  , path = require('path');

var injectFile = path.join(__dirname, 'tmp', 'maia.inject.js');

gulp.task('build-inject', function() {
  return closureGulp('/src/js/inject/index', injectFile);
});

gulp.task('build-userscript', ['build-inject'], function() {
  var metadataBlock = fs.readFileSync(path.join(__dirname, 'src', 'userscript.metablock'));

  var dist = path.join(__dirname, 'dist', 'maia.user.js');

  return closureGulp('/src/js/userscript/index', dist, [
    path.join(__dirname, 'src', 'externs', 'greasemonkey.js')
  ], {
    CORE_INJECT_JS: fs.readFileSync(injectFile)
  }, metadataBlock + '(function(){\n%output%\n}).call(this)');
});
