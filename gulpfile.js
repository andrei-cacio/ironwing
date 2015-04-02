'use strict';

require('jshint-stylish');

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    pkg = require('./package.json'),
    M = {};

M.banner = [
  '/**',
  ' ** <%= pkg.name %> - <%= pkg.description %>',
  ' ** @author <%= pkg.author %>',
  ' ** @version v<%= pkg.version %>',
  ' **/',
  ''
].join('\n');

M._paths = {
    js: './src/**/*.js'
};

gulp.task('build', ['lint'], function() {
    gulp.src(M._paths.js)
        .pipe(concat('M.js'))
        .pipe(header(M.banner, { pkg: pkg}))
        .pipe(gulp.dest('dist'));

    gulp.src(M._paths.js)
        .pipe(concat('M.min.js'))
        .pipe(uglify())
        .pipe(header(M.banner, { pkg: pkg}))
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
    return gulp.src(M._paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function() {
    gulp.watch(M._paths.js, ['lint']);
});

