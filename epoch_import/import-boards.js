var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var db = require(path.join(__dirname, '..', 'db'));
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));

module.exports = function(handler, callback) {
  var querier = mQ.getQuerier(function(err) {
    if (err) {
      return callback(err);
    }
    var boardStream = epochStream.createBoardStream(querier);
    boardStream.pipe(through2.obj(function(boardObject, enc, trCb) {
      db.store(boardObject, function(err, newBoard) {
        if (handler) {
          if (err) {
            handler(err, boardObject, trCb);
          }
          else {
            handler(err, newBoard, trCb);
          }
        }
        else {
          trCb();
        }
      });
    }, function() {
      querier.release();
      return callback();
    }));
  });
};
