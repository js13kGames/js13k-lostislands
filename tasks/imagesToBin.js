const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const imagesFolder = path.resolve(__dirname, '../src/js/assets/images/');
const writeFile = path.resolve(__dirname, '../src/js/assets//spirits.js');

function bin2hex(b) {
    return b.match(/.{4}/g).reduce(function(acc, i) {
        return acc + parseInt(i, 2).toString(16);
    }, '')
}

const imagesToBin = (cb) => fs.readdir(imagesFolder, (err, files) => {
  let lines = ''
  files.forEach(file => {
    let src = require(imagesFolder + '/' + file);
    let varName = file.split('.')[0];
    let line = `export const ${varName} = '${bin2hex(src.join(''))}'` + '\r\n'
    lines += line;
    //console.log('Transfering ', file);
  });

  //console.log('file src:', lines)

  fs.writeFile(writeFile, lines, function(err) {
      if(err) {
          return console.log(err);
      }

      //console.log("The file was saved!");
      cb();
  });
})

module.exports = cb => {
  gulp.task( 'imagesToBin', imagesToBin);
};
