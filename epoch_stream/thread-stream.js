var path = require('path');
var epochMap = require(path.join(__dirname, 'epoch-map'));
var through2 = require('through2');

module.exports = function(mQ, oldBoardId, newBoardId) {
  var table = 'smf_topics';
  var tableMap = {
    posterTime: 'created_at'
  }

  var smfMap = {
    ID_MEMBER : 'ID_MEMBER',
    ID_TOPIC : 'thread_id',
    ID_FIRST_MSG : 'post_id'
  }

  var messageColumns = [
    'icon',
    'ID_BOARD',
    'posterTime',
    'ID_MSG',
    'modifiedTime',
    'ID_MEMBER',
    'subject',
    'body',
    'modifiedName',
    'posterName',
    'ID_TOPIC',
    'ID_MSG_MODIFIED',
    'smileysEnabled'
  ];

  var rowStreamWhere = mQ.createRowStreamWhere(table, { ID_BOARD : oldBoardId});
  var tr = through2.obj(function(row, enc, cb) {
    mQ.getRowsWhereColumn('smf_messages', { ID_MSG : row.ID_FIRST_MSG },
     messageColumns, function(err, firstPost) {
      if (err) {
        console.log(err);
      }
      else if(firstPost) {
        firstPost = firstPost[0];
        var obj = epochMap.remapObject(firstPost, tableMap);
        obj['board_id'] = newBoardId;
        var smfObject = epochMap.remapObject(row, smfMap);
        obj['smf'] = smfObject;
        tr.push(obj);
      }
      else {
        console.log('First post for thread does not exits');
      }
      return cb();
    });
  });
  threadStream = rowStreamWhere.pipe(tr);

  return threadStream;
}
