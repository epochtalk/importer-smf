var path = require('path');
var through2 = require('through2');

module.exports = function(options, newBoard, handler, callback) {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  var callback = args.pop();
  var handler = args.pop();
  var dbPath = options.db;
  var oldBoardId = newBoard.smf.ID_BOARD;
  var newBoardId = newBoard.id;

  // TODO: move || to top level
  var mysqlConfig = options.mQConfig() || require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  // TODO: remove this?
  mysqlConfig.connectionLimit = 5;

  var core = require('epochcore')(dbPath);
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      console.log('Thread Connection Error');
      return callback(err);
    }
  });
  var threadStream = epochStream.threadStream(mQ, oldBoardId, newBoardId);
  threadStream.pipe(through2.obj(function(threadObject, enc, trCb) {
    core.threads.import(threadObject)
    .then(function(newThread) {
      if (handler) {
        handler(null, newThread, trCb);
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
