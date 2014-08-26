
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
  fn = fn || onerror;
  assert(dir, 'directory name is required');
  assert(fs.existsSync(dir), 'directory name must exist');
  process.once('uncaughtException', function(err){
    heapdump.writeSnapshot(path.join(dir, filename()));
    fn(err);
  });
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

/**
 * Default error handler that will log the stacktrace to
 * stderr and then exit the process.
 *
 * @param {Error} err
 * @api private
 */

function onerror(err){
  console.error(err.stack);
  setTimeout(function(){
    console.log('exiting -- crap!');
    process.exit(1);
  }, 1000);
}