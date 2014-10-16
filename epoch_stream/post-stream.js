var path = require('path');
var EpochCollection = require(path.join(__dirname, 'epoch-collection'));
var through2 = require('through2');

module.exports = function(querier, oldThreadId, newThreadId) {
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

  var options = {};
  options.columns = columns;
  options.where = {ID_TOPIC : oldThreadId};
  options.orderBy = 'ID_MSG';

  var rowStream = querier.createRowStream(table, options);
  var tr = through2.obj(function(row, enc, cb) {
    if (row.ID_MEMBER === 0) {
      row.ID_MEMBER = -1;
    }
    var epochCollection = new EpochCollection();
    epochCollection.add('type', 'post');
    epochCollection.map(row, tableMapSafe, {validate: true});
    epochCollection.mapTime(row, timeMapSafe, {validate: true});
    epochCollection.subMap(row, smfMap, {key: 'smf'});
    epochCollection.add('thread_id', newThreadId);
    this.push(epochCollection.collection);
    return cb();
  });
  var postStream = rowStream.pipe(tr);

  return postStream;
};
