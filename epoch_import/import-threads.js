var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var db = require(path.join(__dirname, '..', 'db'));
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));

module.exports = function(newBoard, handler, callback) {
  var querier = mQ.getQuerier(function(err) {
    if (err) {
      return callback(err);
    }
    var msgQuerier = mQ.getQuerier(function(err) {
      if (err) {
        return callback(err);
      }
      var oldBoardId = newBoard.value.smf.ID_BOARD;
      var newBoardId = newBoard.value.smf.ID_BOARD;
      var threadStream = epochStream.createThreadStream(querier, msgQuerier, oldBoardId, newBoardId);
      threadStream.pipe(through2.obj(function(threadObject, enc, trCb) {
        db.store(threadObject, function(err, newThread) {
          if (handler) {
            if(err) {
              handler(err, threadObject, trCb);
            }
            else {
              handler(null, newThread, trCb);
            }
          }
          else {
            trCb();
          }
        });
      }, function() {
        msgQuerier.release();
        querier.release();
        return callback();
      }));
    });
  });
};
