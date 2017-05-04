var gulp = require('gulp')
  , closureGulp = require('./bin/build-gulp').closureCompiler
  , fs = require('fs')
  , path = require('path');

var injectFile = path.join(__dirname, 'tmp', 'maia.inject.js');

gulp.task('build:inject', function() {
  return closureGulp({
    entry_point: '/src/js/inject/index',
    output_file: injectFile
  });
});

gulp.task('build:userscript', ['build:inject'], function() {
  var metadataBlock = fs.readFileSync(path.join(__dirname, 'src', 'userscript.metablock'));

  var dist = path.join(__dirname, 'dist', 'maia.user.js');

  return closureGulp({
    entry_point: '/src/js/userscript/index',
    output_file: dist,
    externs: [
      path.join(__dirname, 'src', 'externs', 'greasemonkey.js')
    ],
    defines: {
      CORE_INJECT_JS: fs.readFileSync(injectFile)
    },
    output_wrapper: metadataBlock + '(function(){\n%output%\n}).call(this)'
  });
});

gulp.task('test:closure', ['test:closure:inject', 'test:closure:userscript']);
gulp.task('test:closure:inject', function() {
  return closureGulp({
    entry_point: '/src/js/inject/index',
    checks_only: true
  });
});
gulp.task('test:closure:userscript', function() {
  return closureGulp({
    entry_point: '/src/js/userscript/index',
    checks_only: true,
    externs: [
      path.join(__dirname, 'src', 'externs', 'greasemonkey.js')
    ],
    defines: {
      CORE_INJECT_JS: "/*NOT NEEDED FOR THE TEST*/"
    }
  });
});
