var path = require('path');
var EpochCollection = require(path.join(__dirname, 'epoch-collection'));
var through2 = require('through2');

module.exports = function(querier) {
  var table = 'smf_topics';
  var tableMapSafe = {
    numViews : 'view_count',
  };

  var smfMap = [
    'ID_BOARD',
    'ID_TOPIC',
    'ID_FIRST_MSG'
  ];

  var options = {};
  options.orderBy = 'ID_TOPIC';

  var rowStream = querier.createRowStream(table, options);
  var tr = through2.obj(function(row, enc, cb) {
    var epochCollection = new EpochCollection();
      epochCollection.add('type', 'thread');
      epochCollection.map(row, tableMapSafe, {validate: true});
      epochCollection.subMap(row, smfMap, {key: 'smf'});
      this.push(epochCollection.collection);
      return cb();
  });
  var threadStream = rowStream.pipe(tr);

  return threadStream;
};
