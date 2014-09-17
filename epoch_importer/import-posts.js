var path = require('path');
var through2 = require('through2');

module.exports = function(options, newThread, handler, callback) {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  var callback = args.pop();
  var handler = args.pop();
  var dbPath = options.db();
  var oldThreadId = newThread.smf.ID_TOPIC;
  var newThreadId = newThread.id;

  // TODO: move || to top level
  var mysqlConfig = options.mQConfig() || require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  // TODO: remove this?
  mysqlConfig.connectionLimit = 10;

  var core = require('epochcore')(dbPath);
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      console.log('Post Connection Error');
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
        handler(err, null, trCb);
      }
      else {
        trCb();
      }
    });
  }, callback));
};
