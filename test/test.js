
var spawn = require('child_process').spawn;
var assert = require('assert');
var path = require('path');
var glob = require('glob');
var fs = require('fs');

function runChild(file, cb) {
  var app = spawn('node', [path.join(__dirname, file)]);
  var stdout = [], stderr = [];
  app.stdout.on('data', stdout.push.bind(stdout));
  app.stderr.on('data', stderr.push.bind(stderr));
  app.on('error', cb);
  app.on('exit', function(code) {
    cb(null, {
      code: code,
      stdout: Buffer.concat(stdout),
      stderr: Buffer.concat(stderr)
    });
  });
}

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
    runChild('app-handler.js', function(err, app) {
      assert.ifError(err);
      assert.equal(app.stdout.toString(), 'bye!\n');
      assert.equal(app.code, 1);
      done();
    });
  });

  it('should write the snapshot', function(done){
    runChild('app-handler.js', function(err, app) {
      assert.ifError(err);
      var pattern = path.join(__dirname, '/*.heapsnapshot');
      glob(pattern, function(err, files){
        if (err) return done(err);
        assert(files.length);
        done();
      });
    });
  });

  it('should use the internal handler by default', function(done){
    runChild('app-defaults.js', function(err, app) {
      assert.ifError(err);
      assert(/Error: ahh/.test(app.stderr.toString()));
      assert.notEqual(app.code, 0);
      done();
    });
  });
});
