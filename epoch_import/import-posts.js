var path = require('path');
var through2 = require('through2');

module.exports = function(options, newThread, handler, callback) {
  var dbPath = options.db;
  var oldThreadId = newThread.smf.ID_TOPIC;
  var newThreadId = newThread.id;

  var mysqlConfig = options.mQConfig;
  // TODO: remove this?
  mysqlConfig.connectionLimit = 1;

  var core = require('epochcore')(dbPath);
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      return callback(err);
    }
  });
  var postStream = epochStream.createPostStream(mQ, oldThreadId, newThreadId);
  postStream.pipe(through2.obj(function(postObject, enc, trCb) {
    core.posts.import(postObject)
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
