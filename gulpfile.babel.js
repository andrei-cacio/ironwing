'use strict';

import jshintStlylish from 'jshint-stylish';

import gulp from 'gulp';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import jshint from 'gulp-jshint';
import header from 'gulp-header';
import browserify from 'browserify';
import webserver from 'gulp-webserver';
import rename from 'gulp-rename';
import pkg from './package.json';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import babelify from 'babelify';

const IW = {};

IW.banner = [
  '/**',
  ' ** <%= pkg.name %> - <%= pkg.description %>',
  ' ** @author <%= pkg.author %>',
  ' ** @version v<%= pkg.version %>',
  ' **/',
  ''
].join('\n');

IW._paths = {
    main: './src/index.js',
    js: './src/**/*.js',
    demo: './demo',
    demoJS: './demo/js'
};
IW.minifiedName = 'ironwing.min.js';

gulp.task('build', ['lint'], () => {
  var b = browserify({
    entries: IW._paths.main,
    debug: true
  }).transform(babelify);

  return b.bundle()
         .pipe(source('app.min.js'))
         .pipe(buffer())
         .pipe(uglify({
          mangle: false
         }))
        .pipe(header(IW.banner, { pkg: pkg }))
        .pipe(rename('ironwing.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', ['lint'], () => {
  var b = browserify({
    entries: IW._paths.main,
    debug: true
  }).transform(babelify);

  return b.bundle()
         .pipe(source('app.min.js'))
         .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true, debug: true}))
        // .pipe(uglify())
        .pipe(header(IW.banner, { pkg: pkg }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(IW._paths.demoJS));
});

gulp.task('lint', () => {
    return gulp.src(IW._paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('webserver', () => {
  gulp.src(IW._paths.demo)
    .pipe(webserver({
      open: true
    }));
});

gulp.task('default', ['webserver'], () => {
    gulp.watch(IW._paths.js, ['scripts']);
});
