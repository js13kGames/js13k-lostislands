'use strict';

const gulp        = require('gulp');
const rollup      = require('rollup-stream');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const srcmaps     = require('gulp-sourcemaps');
const  uglify = require('rollup-plugin-uglify');
const {minify} = require('uglify-es');
const buffer      = require('vinyl-buffer');
const source      = require('vinyl-source-stream');
const rename      = require('gulp-rename');
const livereload  = require('gulp-livereload');
const util        = require('gulp-util');
const imagesToBin = require('./imagesToBin');

function onError( err, pipeline ) {
  util.log( util.colors.red( `Error: ${ err.message }` ) );
  util.beep();
  pipeline.emit('end');
}

module.exports = () => {
  gulp.task( 'build', [ 'build-server-min', 'build-min', 'build-shared-min' ] );

  gulp.task( 'build-shared', () => {
    let pipeline;
    return pipeline = rollup({
      entry: 'src/shared.js', format: 'es', sourceMap: true
    })
    .on( 'error', err => onError( err, pipeline ) )
    .pipe( source( 'shared.js', './src' ) )
    .pipe( buffer() )
    .pipe( srcmaps.init({ loadMaps: true }) )
    .pipe( srcmaps.write( './' ) )
    .pipe( gulp.dest('./public') )
    .pipe( livereload({}) );
  });

  gulp.task( 'build-shared-min', ['build-shared'], () => {
    let pipeline;
    return pipeline = rollup({
      entry: 'src/shared.js', format: 'es', sourceMap: false, plugins: [
          uglify({}, minify)
      ]
    })
    .on( 'error', err => onError( err, pipeline ) )
    .pipe( source( 'shared.js', './src' ) )
    .pipe( buffer() )
    .pipe( rename('shared.min.js') )
    .pipe( gulp.dest('./public') );
  });

  gulp.task( 'build-server', () => {
    let pipeline;
    return pipeline = rollup({
      entry: 'src/server.js', format: 'cjs', sourceMap: true, plugins: [nodeResolve({jsnext:true}), commonjs()]
    })
    .on( 'error', err => onError( err, pipeline ) )
    .pipe( source( 'server.js', './src' ) )
    .pipe( buffer() )
    .pipe( srcmaps.init({ loadMaps: true }) )
    .pipe( srcmaps.write( './' ) )
    .pipe( gulp.dest('./public') )
    .pipe( livereload({}) );
  });

  gulp.task( 'build-server-min', ['build-server'], () => {
    let pipeline;
    return pipeline = rollup({
      entry: 'src/server.js', format: 'cjs', sourceMap: false, plugins: [
          uglify({}, minify), nodeResolve({jsnext:true}), , commonjs()
      ]
    })
    .on( 'error', err => onError( err, pipeline ) )
    .pipe( source( 'server.js', './src' ) )
    .pipe( buffer() )
    .pipe( rename('server.min.js') )
    .pipe( gulp.dest('./public') );
  });

  gulp.task( 'build-client', () => {
    let pipeline;
    return pipeline = rollup({
      entry: 'src/js/main.js', format: 'iife', sourceMap: true
    })
    .on( 'error', err => onError( err, pipeline ) )
    .pipe( source( 'main.js', './src' ) )
    .pipe( buffer() )
    .pipe( srcmaps.init({ loadMaps: true }) )
    .pipe( srcmaps.write( './' ) )
    .pipe( gulp.dest('./public') )
    .pipe( livereload({}) );
  });

  gulp.task( 'build-min', [ 'build-client' ], () => {
    let pipeline;
    return pipeline = rollup({
      entry: 'src/js/main.js', format: 'iife', sourceMap: false, plugins: [
          uglify({}, minify)
      ]
    })
    .on( 'error', err => onError( err, pipeline ) )
    .pipe( source( 'main.js', './src' ) )
    .pipe( buffer() )
      .pipe( rename('main.min.js') )
      .pipe( gulp.dest('./public') );
  });
};
