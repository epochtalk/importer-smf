var path = require('path');
var ObjectBuilder = require(path.join(__dirname, 'object-builder'));
var through2 = require('through2');

module.exports = function(mQ, oldBoardId, newBoardId) {
  var table = 'smf_topics';
  var timeMapSafe = {
    modifiedTime: 'updated_at',
    posterTime: 'created_at'
  };

  var smfMap = [
    'ID_TOPIC',
    'ID_FIRST_MSG'
  ];

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
    var objectBuilder = new ObjectBuilder();
    mQ.getRowsWhereColumn('smf_messages', { ID_MSG : row.ID_FIRST_MSG },
     messageColumns, function(err, firstPost) {
      if (err) {
        console.log(err);
      }
      else if(firstPost) {
        firstPost = firstPost[0];
        objectBuilder.mapTime(firstPost, timeMapSafe, {validate: 'true'});
        objectBuilder.subMap(row, smfMap, {key: 'smf'});
        objectBuilder.insert('board_id', newBoardId);
        tr.push(objectBuilder.newObject);
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
