'use strict';

require('jshint-stylish');

var gulp = require('gulp'),
    uglify = require('gulp-uglifyjs'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    browserify = require('gulp-browserify'),
    pkg = require('./package.json'),
    IW = {};

IW.banner = [
  '/**',
  ' ** <%= pkg.name %> - <%= pkg.description %>',
  ' ** @author <%= pkg.author %>',
  ' ** @version v<%= pkg.version %>',
  ' **/',
  ''
].join('\n');

IW._paths = {
    js: './src/ironwing.js'
};
IW.minifiedName = 'ironwing.min.js';

gulp.task('build', ['lint'], function() {
    gulp.src(IW._paths.js)
        .pipe(browserify({
          insertGlobals : true,
          debug : false
        }))
        .pipe(uglify(IW.minifiedName, {
          mangle: false
        }))
        .pipe(header(IW.banner, { pkg: pkg}))
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
    return gulp.src(IW._paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function() {
    gulp.watch(IW._paths.js, ['lint']);
});

