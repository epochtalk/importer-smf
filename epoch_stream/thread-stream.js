var path = require('path');
var EpochCollection = require(path.join(__dirname, 'epoch-collection'));
var through2 = require('through2');

module.exports = function(querier, msgQuerier, oldBoardId, newBoardId) {
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

  var rowStream = querier.createRowStream(table, options);
  var tr = through2.obj(function(row, enc, cb) {
    var self = this;
    var epochCollection = new EpochCollection();
    var messageOptions = {
      where: {ID_MSG: row.ID_FIRST_MSG},
      columns: messageColumns
    };
    var messageStream = msgQuerier.createRowStream('smf_messages', messageOptions);
    messageStream.pipe(through2.obj(function(firstPost, enc, messageCb) {
      epochCollection.map(row, tableMapSafe, {validate: true});
      epochCollection.subMap(row, smfMap, {key: 'smf'});
      epochCollection.add('board_id', newBoardId);
      epochCollection.mapTime(firstPost, timeMapSafe, {validate: true});
      messageCb();
    }, function() {
      // TODO:  figure out what to do on missing first post
      if (epochCollection.collection.smf) {
        self.push(epochCollection.collection);
      }
      cb();
    }));
  });
  var threadStream = rowStream.pipe(tr);

  return threadStream;
};
