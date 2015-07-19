'use strict';

require('jshint-stylish');

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
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
    js: './src/**/*.js'
};

gulp.task('build', ['lint'], function() {
    gulp.src(IW._paths.js)
        .pipe(concat('ironwing.js'))
        .pipe(header(IW.banner, { pkg: pkg}))
        .pipe(gulp.dest('dist'));

    gulp.src(IW._paths.js)
        .pipe(concat('ironwing.min.js'))
        .pipe(uglify())
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

