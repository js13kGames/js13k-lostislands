'use strict';

const gulp        = require('gulp');

// Bootstrap individual task files
[ 'imagesToBin', 'build', 'css', 'template', 'watch', 'zip' ]
  .forEach( task => require(`./tasks/${ task }`)() );

gulp.task( 'default', [ 'imagesToBin', 'build', 'css', 'template', 'zip', 'report' ] );
