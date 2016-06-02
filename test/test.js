'use strict';

var should = require('should');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');
var xrm = require('../index');
var gulp = require('gulp');

var createVinyl = function createVinyl(filename, contents) {
  var base = path.join(__dirname, 'js');
  var filePath = path.join(base, filename);

  return new gutil.File({
    'cwd': __dirname,
    'base': base,
    'path': filePath,
    'contents': contents || fs.readFileSync(filePath)
  });
};

describe('gulp-xrm', function() {
  beforeEach(function(done) {
    //rimraf(path.join(__dirname, '/results/'), done);
  });

  it('should pass file when it isNull()', function(done) {
    var stream = xrm.sync();
    var emptyFile = {
      'isNull': function () {
        return true;
      }
    };
    stream.on('data', function(data) {
      data.should.equal(emptyFile);
      done();
    });
    stream.write(emptyFile);
  });

  it('should emit error when file isStream()', function (done) {
    var stream = sass.sync();
    var streamFile = {
      'isNull': function () {
        return false;
      },
      'isStream': function () {
        return true;
      }
    };
    stream.on('error', function(err) {
      err.message.should.equal('Streaming not supported');
      done();
    });
    stream.write(streamFile);
  });

  it('should compile a single sass file', function(done) {
    var sassFile = createVinyl('mixins.js');
    var stream = xrm.sync();
    stream.on('data', function(cssFile) {
      should.exist(cssFile);
      should.exist(cssFile.path);
      should.exist(cssFile.relative);
      should.exist(cssFile.contents);
      String(cssFile.contents).should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/mixins.css'), 'utf8')
      );
      done();
    });
    stream.write(sassFile);
  });

  it('should compile multiple sass files', function(done) {
    var files = [
      createVinyl('mixins.js'),
      createVinyl('variables.js')
    ];
    var stream = xrm.sync();
    var mustSee = files.length;
    var expectedPath = 'expected/mixins.css';

    stream.on('data', function(cssFile) {
      should.exist(cssFile);
      should.exist(cssFile.path);
      should.exist(cssFile.relative);
      should.exist(cssFile.contents);
      if (cssFile.path.indexOf('variables') !== -1) {
        expectedPath = 'expected/variables.css';
      }
      String(cssFile.contents).should.equal(
        fs.readFileSync(path.join(__dirname, expectedPath), 'utf8')
      );
      mustSee--;
      if (mustSee <= 0) {
        done();
      }
    });

    files.forEach(function (file) {
      stream.write(file);
    });
  });

  it('should handle sass errors', function(done) {
    var errorFile = createVinyl('error.scss');
    var stream = xrm.sync();

    stream.on('error', function(err) {
      err.message.indexOf('property "font" must be followed by a \':\'').should.not.equal(-1);
      err.relativePath.should.equal('test/scss/error.scss');
      done();
    });
    stream.write(errorFile);
  });
});