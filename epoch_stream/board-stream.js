var path = require('path');
var EpochCollection = require(path.join(__dirname, 'epoch-collection'));
var through2 = require('through2');

module.exports = function(mQ) {
  var table = 'smf_boards';
  var tableMapSafe = {
    name : 'name',
    description : 'description'
  };

  var smfMap = [
    'childLevel',
    'ID_CAT',
    'ID_PARENT',
    'ID_BOARD'
  ];

  var options = {};
  options.orderBy = 'ID_BOARD';

  var rowStream = mQ.createRowStream(table, options);
  var tr = through2.obj(function(row, enc, cb) {
    var epochCollection = new EpochCollection();
    epochCollection.map(row, tableMapSafe, {validate: true});
    epochCollection.subMap(row, smfMap, {key: 'smf'});
    this.push(epochCollection.collection);
    return cb();
  });
  var boardStream = rowStream.pipe(tr);

  return boardStream;
};
