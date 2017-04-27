var gulp = require('gulp')
  , fs = require('fs')
  , path = require('path')
  , closureCompiler = require('google-closure-compiler').gulp()
  , sourcemaps = require('gulp-sourcemaps');

exports.closureCompiler = function(entryPoint, output, externs, defines, output_wrapper) {
  var src = path.join(__dirname, '..', 'src', 'js', '**', '*.js');
  var dist = path.dirname(output);

  var libs = [];
  libs.push(path.join(__dirname, '..', 'node_modules', 'google-closure-library', '**.js'));

  externs = externs || [];
  defines = defines || {};

  var definesC = [];
  Object.keys(defines).forEach(function(key) {
    var value = defines[key];
    definesC.push(key + "=" + value);
  });

  output_wrapper = output_wrapper || '(function(){\n%output%\n}).call(this)';

  return gulp.src(src, { base: '../' })
    //.pipe(sourcemaps.init())
    .pipe(closureCompiler({
        js: libs,
        define: definesC,
        compilation_level: 'ADVANCED',
        warning_level: 'VERBOSE',
        dependency_mode: 'STRICT',
        entry_point: entryPoint,
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ECMASCRIPT5_STRICT',
        output_wrapper: output_wrapper,
        js_output_file: path.basename(output),
        env: 'BROWSER',
        externs: externs,
        assume_function_wrapper: true
      }))
    //.pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(dist));
};
