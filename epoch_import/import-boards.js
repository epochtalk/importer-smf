var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var db = require(path.join(__dirname, '..', 'db'));
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
var logfile = require(path.join(__dirname, '..', 'log'));
var statLogger = require(path.join(__dirname, '..', 'stats'));

module.exports = function(callback) {
  var querier = mQ.getQuerier(function(err) {
    if (err) {
      statLogger.increment('errors');
      logfile.write('Board connection:');
      logfile.write(err.toString());
      return callback(err);
    }
    var boardStream = epochStream.createBoardStream(querier);
    boardStream.pipe(through2.obj(function(boardObject, enc, trCb) {
      trCb();
      db.store(boardObject, function(err, newBoard) {
        if (err) {
          statLogger.increment('errors');
          logfile.write('Board: ' + boardObject.smf.ID_BOARD + '\n');
          logfile.write(err.toString() + '\n');
        }
        else {
          statLogger.increment('boards');
        }
      });
    }, function() {
      statLogger.tag('boards', '(finished)');
      querier.release();
      return callback(null, 'Board import succeded');
    }));
  });
};
