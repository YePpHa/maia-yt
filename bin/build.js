var ClosureCompiler = require('google-closure-compiler').compiler
  , path = require('path');

var src_path = path.join(__dirname, '..', 'src');
var files = path.join(src_path, '**', '*.js');
var entry_point = path.join(src_path, 'userscript', 'index');

var closure_library = path.join(__dirname, '..', 'node_modules', 'google-closure-library');
var closure_library_path = path.join(closure_library, 'closure', 'goog', '**', '*.js');
var closure_library_thirdparty_path = path.join(closure_library, 'third-party', 'closure', 'goog', 'deps.js');

var js = [
  files,
  path.join(closure_library, 'closure', 'goog', '**', '*.js'),
  '!' + path.join(closure_library, 'closure', 'goog', '**', '*_test.js'),
  path.join(closure_library, 'third-party', 'closure', 'goog', '**', '*.js'),
  '!' + path.join(closure_library, 'third-party', 'closure', 'goog', '**', '*_test.js')
];

var closureCompiler = new ClosureCompiler({
  js: js,
  compilation_level: 'ADVANCED',
  language_in: 'ECMASCRIPT6_STRICT',
  language_out: 'ECMASCRIPT5_STRICT',
  dependency_mode: 'STRICT',
  entry_point: entry_point
});

var compilerProcess = closureCompiler.run(function(exitCode, stdOut, stdErr) {
  console.log(exitCode, stdErr);
});
