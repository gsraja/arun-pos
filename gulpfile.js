const { src, dest, task, parallel, watch, series } = require('gulp');
const pug = require('gulp-pug');
const {formatHTML} = require('gulp-format-html');
const printAst = require('./pug-alphine.js');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const ts = require('gulp-typescript');
const serve = require('gulp-serve');

task('serve', serve({
  root: ['final'],
  port: 80,
}));

var inlinesource = require('gulp-inline-source');
 
task('inline', function () {
    let options = {
        compress: false
    };

    return src('./dist/*.html')
        .pipe(inlinesource(options))
        .pipe(dest('./final'));
});

task('copy-static', function() {
  return src('./src/static/*')
    .pipe(dest('./dist'));
});
 
task('ts', function () {
    return src('src/**/*.ts')
        .pipe(ts({
          noImplicitAny: true,
          moduleResolution: 'node',
          module: 'none'
        }))
        .pipe(concat('output.js'))
        .pipe(dest('./dist'));
});


task('pug', () =>
    src('./src/index.pug')
        .pipe(
          pug({
            plugins : [printAst]
          })
        )
        .pipe(formatHTML())
        .pipe(dest('./dist'))
);



exports.default = parallel('pug', 'ts', 'copy-static')
exports.in = series('inline')

exports.watch = () => {
  exports.default();
  watch('src/**/*.ts', series('ts'))
  watch('src/**/*.pug', series('pug'))
}