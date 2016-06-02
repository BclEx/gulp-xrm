# gulp-xrm v0.1.0

> Gulp build task to continuously scaffold an xrm platform


# Install

```
npm install gulp-xrm --save-dev
```

# Basic Usage

Something like this will compile your Xrm files:

```javascript
'use strict';

var gulp = require('gulp');
var gulpXrm = require('gulp-xrm');

gulp.task('xrm', function () {
  return gulp.src('./xrm/**/*.js')
    .pipe(gulpXrm().on('error', xrm.logError));
});

gulp.task('xrm:watch', function () {
  gulp.watch('./xrm/**/*.js', ['xrm']);
});
```

## xrm task
_Run this task with the `gulp xrm` command._

Task targets, files and options may be specified according to the gulp [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

This task primarily scaffolds a xrm platform. Options described below.


#### option1
Type: `Boolean` `Object`  
Default: `{}`

Turn on or off mangling with default options. If an `Object` is specified, it is passed directly to `ast.mangle_names()` *and* `ast.compute_char_frequency()` (mimicking command line behavior). [View all options here](https://github.com/mishoo/UglifyJS2#mangler-options).

#### option2
Type: `Boolean` `Object`  
Default: `{}`

## Release History

 * 2015-06-01   v0.1.0   Work in progress, not yet officially released.