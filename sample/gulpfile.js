'use strict';
var gulp = require('gulp');
var xrm = require('gulp-xrm');

gulp.task('xrm', function () {
    return gulp.src('./xrm/**/*.js')
      .pipe(xrm.sync({
          database: 'mssql', //'mssql',
          client: 'react', // 'react',
          server: 'aspnet', // 'aspnet',
          template: {
            serverAspnet: 'template/server-aspnet',
          },
          dest: {
              html: 'gen/Views',
              js: 'gen/js',
              css: 'gen/css',
              database: 'gen/Databases',
              api: 'gen/',
          }
      }).on('error', xrm.logError));
});

gulp.task('xrm:watch', function () {
    gulp.watch('./xrm/**/*.js', ['xrm']);
});

gulp.task('default', ['xrm:watch'], function () {
});
