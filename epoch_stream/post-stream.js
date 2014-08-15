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
    ID_MSG : 'post_id'
  }

  var rowStreamWhere = mQ.createRowStreamWhere(table, { ID_TOPIC : oldThreadId});
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
