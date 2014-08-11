var mysqlQuerier = require('../mysqlQuerier/mysqlQuerier');
var config = require('../config.json');
var mQ = mysqlQuerier(config);
var through2 = require('through2');

rowStream = mQ.createRowStream(null, process.argv[2]);
rowStream.pipe(through2.obj(function (row, enc, cb) {
  console.log(row);
  cb();
},
function () {
  mQ.end();
}));
