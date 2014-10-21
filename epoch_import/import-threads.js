var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var db = require(path.join(__dirname, '..', 'db'));
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
var logfile = require(path.join(__dirname, '..', 'log'));
var statLogger = require(path.join(__dirname, '..', 'stats'));

module.exports = function(callback) {
  var querier = mQ.getQuerier(function(err) {
    if (err) {
      statLogger.increment('errors');
      logfile.write('Thread connection:');
      logfile.write(err.toString());
      return callback(err);
    }
    var threadStream = epochStream.createThreadStream(querier);
    threadStream.pipe(through2.obj(function(threadObject, enc, trCb) {
      trCb();
      db.store(threadObject, function(err, newThread) {
        if (err) {
          statLogger.increment('errors');
          logfile.write('Thread: ' + threadObject.smf.ID_TOPIC + '\n');
          logfile.write(err.toString() + '\n');
        }
        else {
          statLogger.increment('threads');
        }
      });
    }, function() {
      statLogger.tag('threads', '(finished)');
      querier.release();
      return callback(null, 'Thread import succeded');
    }));
  });
};
