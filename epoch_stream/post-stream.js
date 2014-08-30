var path = require('path');
var epochMap = require(path.join(__dirname, 'epoch-map'));
var through2 = require('through2');

module.exports = function(mQ, oldThreadId, newThreadId) {
  var table = 'smf_messages';
  var tableMap = {
    subject : 'title',
    body : 'body',
    posterTime: 'created_at'
  }

  var smfMap = {
    ID_MEMBER : 'ID_MEMBER',
    ID_MSG : 'post_id'
  }

  var columns = [
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

  var rowStreamWhere = mQ.createRowStreamWhere(table, { ID_TOPIC : oldThreadId}, columns);
  var tr = through2.obj(function(row, enc, cb) {
    var obj = epochMap.remapObject(row, tableMap);
    // Handling for created_at
    obj['created_at'] = row.posterTime;
    obj['thread_id'] = newThreadId;
    var smfObject = epochMap.remapObject(row, smfMap);
    obj['smf'] = smfObject;
    this.push(obj);
    return cb();
  });
  postStream = rowStreamWhere.pipe(tr);

  return postStream;
}
