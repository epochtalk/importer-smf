var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var db = require(path.join(__dirname, '..', 'db'));

module.exports = function(newThread, handler, callback) {
  var oldThreadId = newThread.smf.ID_TOPIC;
  var newThreadId = newThread.id;

  var mysqlConfig = args.mysqlConfig;
  mysqlConfig.connectionLimit = 1;

  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      return callback(err);
    }
  });
  var postStream = epochStream.createPostStream(mQ, oldThreadId, newThreadId);
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
    mQ.end();
    callback();
  }));
};
