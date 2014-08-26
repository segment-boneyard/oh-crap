
var spawn = require('child_process').spawn;
var assert = require('assert');
var path = require('path');
var glob = require('glob');
var fs = require('fs');

describe('oh-crap', function(){
  after(function(done){
    var pattern = path.join(__dirname, '/*.heapsnapshot');
    glob(pattern, function(err, files){
      if (err) return done(err);
      files.forEach(fs.unlinkSync);
      done();
    });
  });

  it('should call the user provided error handler', function(done){
    var app = spawn('node', [path.join(__dirname, 'app-handler.js')]);
    app.stdout.once('data', function(data){
      assert(data.toString() === 'bye!\n');
    });
    app.on('exit', function(code){
      assert(code === 1);
      done();
    });
  });

  it('should write the snapshot', function(done){
    var app = spawn('node', [path.join(__dirname, 'app-handler.js')]);
    app.on('exit', function(code){
      var pattern = path.join(__dirname, '/*.heapsnapshot');
      glob(pattern, function(err, files){
        if (err) return done(err);
        assert(files.length);
        done();
      });
    });
  });

  it('should use the internal handler by default', function(done){
    var app = spawn('node', [path.join(__dirname, 'app-defaults.js')]);
    app.stdout.once('data', function(data){
      assert(data.toString() === 'exiting -- crap!\n');
    });
    app.stderr.once('data', function(data){
      assert(data.toString().split('\n')[0] === 'Error: ahh');
    });
    app.on('exit', function(code){
      assert(code === 1);
      done();
    });
  });
});