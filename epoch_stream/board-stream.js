var path = require('path');
var objectBuilder = require(path.join(__dirname, 'object-builder'));
var through2 = require('through2');

module.exports = function(mQ) {
  var table = 'smf_boards';
  var tableMapSafe = {
    name : 'name',
    description : 'description'
  };

  var smfMap = [
    'ID_BOARD'
  ];

  var rowStream = mQ.createRowStream(table);
  var tr = through2.obj(function(row, enc, cb) {
    objectBuilder.map(row, tableMapSafe, {validate: true});
    objectBuilder.subMap(row, smfMap, {key: 'smf'});
    this.push(objectBuilder.toObject());
    return cb();
  });
  boardStream = rowStream.pipe(tr);

  return boardStream;
}
