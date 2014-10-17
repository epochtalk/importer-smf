var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var db = require(path.join(__dirname, '..', 'db'));
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));

module.exports = function(callback) {
  var querier = mQ.getQuerier(function(err) {
    if (err) {
      return callback([err]);
    }
    var boards = [];
    var errors = [];
    var boardStream = epochStream.createBoardStream(querier);
    boardStream.pipe(through2.obj(function(boardObject, enc, trCb) {
      if (boardObject.smf.childLevel) {
        boardObject.smf.ID_CAT = 0;
      }
      var childLevel = boardObject.smf.childLevel;
      var ID_CAT = boardObject.smf.ID_CAT;
      delete boardObject.smf.childLevel;
      delete boardObject.smf.ID_CAT;
      db.boards.import(boardObject)
      .then(function(newBoard) {
        newBoard.smf.childLevel = childLevel;
        newBoard.smf.ID_CAT = ID_CAT;
        boards.push(newBoard);
        trCb();
      })
      .catch(function(err){
        errors.push({error: err, board: boardObject});
        trCb();
      });
    }, function() {
      querier.release();
      return callback(errors, boards);
    }));
  });
};
