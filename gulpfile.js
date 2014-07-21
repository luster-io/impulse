'use strict';
// Generated on 2014-05-10 using generator-browserify 0.2.2

var gulp = require('gulp');
var bower = 'app/bower_components';

// Load plugins
var $ = require('gulp-load-plugins')();

// Styles
gulp.task('styles', function () {
  // See https://github.com/andrew/node-sass for more options
  return gulp.src('app/scss/app.scss')
    .pipe($.sass({
      outputStyle: 'expanded',
      includePaths: ['app/bower_components/foundation/scss']
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe($.csso())
    .pipe(gulp.dest('dist/styles'))
    .pipe($.size())
    .pipe($.connect.reload());
});

// Vendor
gulp.task('vendor', function () {
  return gulp.src([
    bower + '/angular/angular.js',
    bower + '/angular-route/angular-route.js',
    bower + '/lodash/dist/lodash.js'
    ])
    .pipe($.browserify({
      debug: true,
      transform: [
        'debowerify'
      ],
      shim: {
        lodash: {
          path: bower + '/lodash/dist/lodash.js',
          exports: 'lodash'
        }
      }
    }))
    .pipe($.concat('vendor.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe($.size());
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src('app/scripts/main.js')
    .pipe($.browserify({
      debug: true,
      transform: [
        'debowerify'
      ],
      // Note: At this time it seems that you will also have to
      // setup browserify-shims in package.json to correctly handle
      // the exclusion of vendor vendor libraries from your bundle
      external: ['lodash'],
      extensions: ['.js']
    }))
    // .pipe($.uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe($.size())
    .pipe($.connect.reload());
});

// HTML
gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

// Lint
gulp.task('lint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter(require('jshint-stylish')))
});

// Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false}).pipe($.clean());
});

// Build

gulp.task('build', ['html', 'styles', 'scripts', 'images']);

// Dev Server

gulp.task('dev', ['html', 'styles', 'scripts', 'images', 'connect', 'watch']);

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('dev');
});

// Connect
gulp.task('connect', $.connect.server({
  root: __dirname + '/dist',
  port: 9000,
  livereload:{
    port: 35729
  },
  open: {
    file: 'index.html',
    browser: 'Google Chrome'
  },
}));

// Watch
gulp.task('watch', ['connect'], function () {
    // Watch for changes in `app` folder
    gulp.watch([
        'app/scss/**/*.scss',
        'app/scripts/**/*.js',
        'app/images/**/*',
        'lib/**/*.js'
    ], $.connect.reload);

    // Watch .scss files
    gulp.watch('app/scss/**/*.scss', ['styles']);


    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('lib/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);


    // Watch .html files
    gulp.watch('app/**/*.html', ['html']);
});
