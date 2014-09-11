
/**
 * Module dependencies.
 */

var heapdump = require('heapdump');
var assert = require('assert');
var util = require('util');
var path = require('path');
var fs = require('fs');

/**
 * Export `crap`.
 */

module.exports = crap;

/**
 * Write out the snapshot upon an uncaught exception.
 */

function crap(dir, fn){
  assert(dir, 'directory name is required');
  assert(fs.existsSync(dir), 'directory name must exist');
  var origEmit = process.emit;
  process.emit = function (type) {
    if (type === 'uncaughtException') {
      heapdump.writeSnapshot(path.join(dir, filename()));
    }

    return origEmit.apply(this, arguments);
  };
  fn && process.once('uncaughtException', fn);
};

/**
 * Generates the filename to be used for writing the snapshot.
 *
 * @return {String}
 * @api private
 */

function filename(){
  var now = Date.now();
  var nanos = process.hrtime()[1];
  return util.format('crap-%s-%s.heapsnapshot', now, nanos);
}
