var path = require('path');
var epochMap = require(path.join(__dirname, 'epoch-map'));
var through2 = require('through2');

module.exports = function(mQ, oldBoardId, newBoardId) {
  var table = 'smf_topics';
  var tableMap = {
    posterTime: 'created_at'
  }

  var smfMap = {
    ID_TOPIC : 'thread_id',
    ID_FIRST_MSG : 'post_id'
  }

  var rowStreamWhere = mQ.createRowStreamWhere(table, { ID_BOARD : oldBoardId});
  var tr = through2.obj(function(row, enc, cb) {
    mQ.getRowsWhere('smf_messages', { ID_MSG : row.ID_FIRST_MSG }, function(err, firstPost) {
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
