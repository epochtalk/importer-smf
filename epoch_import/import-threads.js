var path = require('path');
var through2 = require('through2');

module.exports = function(options, newBoard, handler, callback) {
  var dbPath = options.db;
  var oldBoardId = newBoard.smf.ID_BOARD;
  var newBoardId = newBoard.id;

  var mysqlConfig = options.mQConfig;
  // TODO: remove this?
  mysqlConfig.connectionLimit = 2;

  var core = require('epochcore')(dbPath);
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      return callback(err);
    }
  });
  var threadStream = epochStream.createThreadStream(mQ, oldBoardId, newBoardId);
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
        handler(err, threadObject, trCb);
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
