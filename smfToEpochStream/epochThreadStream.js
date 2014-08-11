var epochMap = require(__dirname + '/epochMap');
var through2 = require('through2');

var EpochThreadStream = module.exports = function EpochThreadStream(mQ) {
  if (!(this instanceof EpochThreadStream)) {
    return new EpochThreadStream(mQ);
  }
  this.mQ = mQ;
}

EpochThreadStream.prototype.createThreadStream = function (err, oldBoardId, newBoardId) {
  var table = 'smf_topics';
  var tableMap = {
    subject : 'title',
    body: 'body',
    posterTime: 'created_at'
  }

  var smfMap = {
    ID_TOPIC : 'thread_id',
    ID_FIRST_MSG : 'post_id'
  }

  var rowStreamWhere = this.mQ.createRowStreamWhere(null, table, { ID_BOARD : oldBoardId});
  var mQ = this.mQ;
  var tr = through2.obj(function (row, enc, cb) {
    mQ.getRowsWhere(null, 'smf_messages', { ID_MSG : row.ID_FIRST_MSG }, function (err, firstPost) {
      firstPost = firstPost[0];
      var obj = epochMap.remapObject(firstPost, tableMap);
      obj['board_id'] = newBoardId;
      var smfObject = epochMap.remapObject(row, smfMap);
      obj['smf'] = smfObject;
      tr.push(obj);
      return cb();
    });
  });
  threadStream = rowStreamWhere.pipe(tr);

  return threadStream;
}
