var path = require('path');
var EpochCollection = require(path.join(__dirname, 'epoch-collection'));
var through2 = require('through2');

module.exports = function(mQ, oldBoardId, newBoardId) {
  var table = 'smf_topics';
  var tableMapSafe = {
    numViews : 'view_count',
  };
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

  var options = {};
  options.where = {ID_BOARD : oldBoardId};
  options.orderBy = 'ID_TOPIC';

  var rowStream = mQ.createRowStream(table, options);
  var tr = through2.obj(function(row, enc, cb) {
    var epochCollection = new EpochCollection();
    mQ.getRowsWhereColumn('smf_messages', { ID_MSG : row.ID_FIRST_MSG },
     messageColumns, function(err, firstPostQuery) {
      if (err) {
        console.log(err);
      }
      else if(firstPostQuery) {
        if (firstPostQuery.length > 0) {
          var firstPost = firstPostQuery[0];
          epochCollection.mapTime(firstPost, timeMapSafe, {validate: true});
        }
        epochCollection.map(row, tableMapSafe, {validate: true});
        epochCollection.subMap(row, smfMap, {key: 'smf'});
        epochCollection.add('board_id', newBoardId);
        tr.push(epochCollection.collection);
      }
      else {
        console.log('First post for thread does not exist');
      }
      return cb();
    });
  });
  var threadStream = rowStream.pipe(tr);

  return threadStream;
};
