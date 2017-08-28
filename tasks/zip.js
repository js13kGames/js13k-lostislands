'use strict';

const gulp      = require('gulp');
const zip       = require('gulp-zip');
const rename    = require('gulp-rename');
const util      = require('gulp-util');
const fs        = require('fs');

module.exports = () => {
  gulp.task( 'zip', [ 'build', 'template' ], () => {
    return gulp.src(['./public/index.min.html', './public/server.min.js', './public/shared.min.js'])
      .pipe( rename(path=> {
        path.basename = path.basename.replace('.min', '')
      }))
      .pipe( zip('game.zip') )
      .pipe( gulp.dest('public') );
  });

  gulp.task( 'report', [ 'zip' ], done => {
    fs.stat( './public/game.zip', ( err, data ) => {
      if ( err ) {
        util.beep();
        return done( err );
      }
      util.log(
        util.colors.yellow.bold(`Current game size: ${ data.size } bytes`)
      );
      let percent = parseInt( ( data.size / 13312 ) * 100, 10 );
      util.log(
        util.colors.yellow.bold(`${ percent }% of total game size used`)
      );
      done();
    });
  });
};
