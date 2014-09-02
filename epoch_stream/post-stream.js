var path = require('path');
var ObjectBuilder = require(path.join(__dirname, 'object-builder'));
var through2 = require('through2');

module.exports = function(mQ, oldThreadId, newThreadId) {
  var table = 'smf_messages';
  var tableMapSafe = {
    subject : 'title',
    body : 'body'
  };
  var timeMapSafe = {
    posterTime: 'created_at',
    modifiedTime: 'updated_at'
  };
  var smfMap = [
    'ID_MEMBER',
    'ID_MSG'
  ];

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
    var objectBuilder = new ObjectBuilder();
    objectBuilder.map(row, tableMapSafe, {validate: true});
    objectBuilder.mapTime(row, timeMapSafe, {validate: true});
    objectBuilder.subMap(row, smfMap, {key: 'smf'});
    objectBuilder.insert('thread_id', newThreadId);
    this.push(objectBuilder.newObject);
    return cb();
  });
  postStream = rowStreamWhere.pipe(tr);

  return postStream;
}
