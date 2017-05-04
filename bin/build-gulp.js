var gulp = require('gulp')
  , fs = require('fs')
  , path = require('path')
  , closureCompiler = require('google-closure-compiler').gulp()
  , sourcemaps = require('gulp-sourcemaps');

exports.closureCompiler = function(options) {
  if (!options.entry_point) throw new Error("No entry point declared.");
  if (!options.checks_only && !options.output_file)
    throw new Error("No output file declared.");

  var src = path.join(__dirname, '..', 'src', 'js', '**', '*.js');
  var dist = options.output_file && path.dirname(options.output_file);

  var libs = [];
  libs.push(path.join(__dirname, '..', 'node_modules', 'google-closure-library', '**.js'));
  libs.push("!" + path.join(__dirname, '..', 'node_modules', 'google-closure-library', '**_test.js'));

  var externs = options.externs || [];
  var defines = options.defines || {};

  var definesC = [];
  Object.keys(defines).forEach(function(key) {
    var value = defines[key];
    definesC.push(key + "=" + value);
  });

  var output_wrapper = options.output_wrapper || '(function(){\n%output%\n}).call(this)';

  var os = gulp.src(src, { base: '.' });
  if (options.sourcemaps) {
    os = os.pipe(sourcemaps.init());
  }

  var closure_options = {
    js: libs,
    define: definesC,
    compilation_level: 'ADVANCED',
    warning_level: 'VERBOSE',
    dependency_mode: 'STRICT',
    entry_point: options.entry_point,
    language_in: 'ECMASCRIPT6_STRICT',
    language_out: 'ECMASCRIPT5_STRICT',
    output_wrapper: output_wrapper,
    externs: externs,
    assume_function_wrapper: true
  };
  if (options.checks_only) {
    closure_options.checks_only = true;
    closure_options.jscomp_error = [
      "checkTypes",
      "conformanceViolations",
      "functionParams",
      "globalThis",
      "invalidCasts",
      "misplacedTypeAnnotation",
      "nonStandardJsDocs",
      "suspiciousCode",
      "uselessCode"
    ];
  } else {
    closure_options.js_output_file = path.basename(options.output_file);
  }

  os = os.pipe(closureCompiler(closure_options));

  if (options.sourcemaps) {
    os = os.pipe(sourcemaps.write('/'));
  }

  if (options.checks_only)
    return os;
  return os.pipe(gulp.dest(dist));
};
