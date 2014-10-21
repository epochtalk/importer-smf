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
      logfile.write('Post connection:');
      logfile.write(err.toString());
      return callback(err);
    }
    var postStream = epochStream.createPostStream(querier);
    postStream.pipe(through2.obj(function(postObject, enc, trCb) {
      trCb();
      db.store(postObject, function(err, newPost) {
        if (err) {
          statLogger.increment('errors');
          logfile.write('Post: ' + postObject.smf.ID_MSG + '\n');
          logfile.write(err.toString() + '\n');
        }
        else {
          statLogger.increment('posts');
        }
      });
    }, function() {
      statLogger.tag('posts', '(finished)');
      querier.release();
      return callback(null, 'Post import succeded');
    }));
  });
};
