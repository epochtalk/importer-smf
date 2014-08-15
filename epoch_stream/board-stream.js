var path = require('path');
var epochMap = require(path.join(__dirname, 'epoch-map'));
var through2 = require('through2');

var EpochBoardStream = module.exports = function EpochBoardStream(mQ) {
  if (!(this instanceof EpochBoardStream)) {
    return new EpochBoardStream(mQ);
  }
  this.mQ = mQ;
}

EpochBoardStream.prototype.createBoardStream = function (err) {
  var table = 'smf_boards';
  var tableMap = {
    name : 'name',
    description : 'description'
  }

  var smfMap = {
    ID_BOARD : 'board_id'
  }

  var rowStream = this.mQ.createRowStream(table);
  var tr = through2.obj(function (row, enc, cb) {
    var obj = epochMap.remapObject(row, tableMap);
    var smfObject = epochMap.remapObject(row, smfMap);
    obj['smf'] = smfObject;
    this.push(obj);
    return cb();
  });
  boardStream = rowStream.pipe(tr);

  return boardStream;
}
