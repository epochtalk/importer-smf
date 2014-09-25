var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var db = require(path.join(__dirname, '..', 'db'));

module.exports = function(handler, callback) {
  var mysqlConfig = args.mysqlConfig;
  mysqlConfig.connectionLimit = 1;

  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      return callback(err);
    }
  });
  var boardStream = epochStream.createBoardStream(mQ);
  boardStream.pipe(through2.obj(function(boardObject, enc, trCb) {
    if (boardObject.smf.childLevel) {
      boardObject.smf.ID_CAT = 0;
    }
    db.boards.import(boardObject)
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
