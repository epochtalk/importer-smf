var path = require('path');
var through2 = require('through2');

module.exports = function(options, handler, callback) {
  var dbPath = options.db;

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
  var boardStream = epochStream.createBoardStream(mQ);
  boardStream.pipe(through2.obj(function(boardObject, enc, trCb) {
    core.boards.import(boardObject)
    .then(function(newBoard) {
      if (handler) {
        handler(null, newBoard, trCb);
      }
      else {
        trCb();
      }
    })
    .catch(function(err){
      if (handler) {
        handler(err, boardObject, trCb);
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
