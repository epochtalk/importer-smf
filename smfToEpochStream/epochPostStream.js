var epochMap = require(__dirname + '/epochMap');
var through2 = require('through2');

var EpochPostStream = module.exports = function EpochPostStream(mQ) {
  if (!(this instanceof EpochPostStream)) {
    return new EpochPostStream(mQ);
  }
  this.mQ = mQ;
}

EpochPostStream.prototype.createPostStream = function (err, oldThreadId, newThreadId) {
  var table = 'smf_messages';
  var tableMap = {
    subject : 'title',
    body : 'body',
    posterTime: 'created_at'
  }

  var smfMap = {
    ID_MSG : 'post_id'
  }

  var rowStreamWhere = this.mQ.createRowStreamWhere(null, table, { ID_TOPIC : oldThreadId});
  var tr = through2.obj(function (row, enc, cb) {
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
