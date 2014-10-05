var path = require('path');
var EpochCollection = require(path.join(__dirname, 'epoch-collection'));
var through2 = require('through2');

module.exports = function(querier) {
  var table = 'smf_categories';
  var tableMapSafe = {
    name: 'name'
  };
  var smfMap = [
    'ID_CAT'
  ];

  var options = {};
  options.orderBy = 'catOrder';

  var rowStream = querier.createRowStream(table, options);
  var tr = through2.obj(function(row, enc, cb) {
    var epochCollection = new EpochCollection();
    epochCollection.map(row, tableMapSafe, {validate: true});
    epochCollection.subMap(row, smfMap, {key: 'smf'});
    this.push(epochCollection.collection);
    return cb();
  });
  var categoryStream = rowStream.pipe(tr); return categoryStream;
};
