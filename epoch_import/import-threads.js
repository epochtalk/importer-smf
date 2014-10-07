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
      var oldBoardId = newBoard.smf.ID_BOARD;
      var newBoardId = newBoard.id;
      var threadStream = epochStream.createThreadStream(querier, msgQuerier, oldBoardId, newBoardId);
      threadStream.pipe(through2.obj(function(threadObject, enc, trCb) {
        db.threads.import(threadObject)
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
        msgQuerier.release();
        querier.release();
        return callback();
      }));
    });
  });
};
