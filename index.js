/*
 * gulp-xrm
 * 
 *
 * Copyright (c) 2015 
 * Licensed under the MIT license.
 */

'use strict';

// External libs.
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var debug = require('debug')('gulp:xrm');
var assign = require('object-assign');

var PLUGIN_NAME = 'gulp-xrm';

//////////////////////////////
// Main Gulp Xrm function
//////////////////////////////
var gulpXrm = function gulpXrm(options, sync) {

  return through.obj(function (file, enc, cb) {
    if (options.limit == 0) {
      return cb(null, file);
    } else if (options.limit > 0) {
      options.limit = options.limit - 1;
    }
    
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }
    if (path.basename(file.path).indexOf('_') === 0) {
      return cb();
    }
    if (!file.contents.length) {
      file.path = gutil.replaceExtension(file.path, '.js');
      return cb(null, file);
    }

    var opts = assign({}, options);
    var self = this;

    this.env = require('yeoman-environment').createEnv();
    this.env.on('error', function (err) {
      console.error(false ? err.stack : err.message);
    });

    function process(ctx, name, dest, options) {
      debug('Running ' + name);
      options['skip-install'] = true;
      ctx.name = name;
      options.dest = dest;
      this.env.run(['xrm', ctx], options, function (err) {
        debug('Finished ' + name + ' processing');
      });
    };

    function addInQueue(file, dest) {
      // Read file source.
      var nameParts = getObjectNameParts(path.basename(file.path, '.js'));
      var ctx = eval('[' + file.contents.toString() + ']')[0];
      ctx.searchPaths = [path.dirname(file.path)];
      ctx.schemaName = nameParts[0];
      var args = [ctx, nameParts[1], dest, opts];
      //addMethod(process, args, file);
      debug('Queueing ' + nameParts[1]);
      process.apply(self, args);
    }

    this.env.lookup(function () {
      addInQueue(file, opts.dest)
      cb(null, file);
    }.bind(this));


    // //////////////////////////////
    // // Handles returning the file to the stream
    // //////////////////////////////
    // var filePush = function filePush(xrmObj) {
    //   console.log(xrmObj);
    //   cb(null, file);
    // };

    // //////////////////////////////
    // // Handles error message
    // //////////////////////////////
    // var errorM = function errorM(error) {
    //   var relativePath = '',
    //     filePath = error.file === 'stdin' ? file.path : error.file,
    //     message = '';

    //   filePath = filePath ? filePath : file.path;
    //   relativePath = path.relative(process.cwd(), filePath);

    //   message += gutil.colors.underline(relativePath) + '\n';
    //   message += error.formatted;

    //   error.messageFormatted = message;
    //   error.messageOriginal = error.message;
    //   error.message = gutil.colors.stripColor(message);

    //   error.relativePath = relativePath;

    //   return cb(new gutil.PluginError(
    //     PLUGIN_NAME, error
    //   ));
    // };

    // if (sync !== true) {
    //   //////////////////////////////
    //   // Async Xrm render
    //   //////////////////////////////
    //   var callback = function (error, obj) {
    //     if (error) {
    //       return errorM(error);
    //     }
    //     filePush(obj);
    //   };
    // }
    // else {
    //   //////////////////////////////
    //   // Sync Xrm render
    //   //////////////////////////////
    //   try {
    //     var result = gulpXrm.compiler.renderSync(opts);
    //     filePush(result);
    //   }
    //   catch (error) {
    //     return errorM(error);
    //   }
    // }
  });
};

//////////////////////////////
// Sync Xrm render
//////////////////////////////
gulpXrm.sync = function sync(options) {
  return gulpXrm(options, true);
};

//////////////////////////////
// Log errors nicely
//////////////////////////////
gulpXrm.logError = function logError(error) {
  var message = new gutil.PluginError('xrm', error.messageFormatted).toString();
  process.stderr.write(message + '\n');
  this.emit('end');
};

module.exports = gulpXrm;

function getObjectNameParts(objectName) {
  var pieces = objectName.split('.');
  if (!pieces || pieces.length === 1) {
    return ['dbo', pieces ? pieces[0] : objectName];
  }
  return [pieces[0], pieces[1]];
}