var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var db = require(path.join(__dirname, '..', 'db'));
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));

module.exports = function(newThread, handler, callback) {
  var querier = mQ.getQuerier(function(err) {
    if (err) {
      return callback(err);
    }
    var oldThreadId = newThread.smf.ID_TOPIC;
    var newThreadId = newThread.id;
    var postStream = epochStream.createPostStream(querier, oldThreadId, newThreadId);
    postStream.pipe(through2.obj(function(postObject, enc, trCb) {
      db.posts.import(postObject)
      .then(function(newPost) {
        if (handler) {
          handler(null, newPost, trCb);
        }
        else {
          trCb();
        }
      })
      .catch(function(err){
        if (handler) {
          handler(err, postObject, trCb);
        }
        else {
          trCb();
        }
      });
    }, function() {
      querier.release();
      callback();
    }));
  });
};
