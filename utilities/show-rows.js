var path = require('path');
var mysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier', 'mysql-querier'));
var mQConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
var mQ = mysqlQuerier(mQConfig);
var through2 = require('through2');

rowStream = mQ.createRowStream(process.argv[2]);
rowStream.pipe(through2.obj(function (row, enc, cb) {
  console.log(row);
  cb();
},
function () {
  mQ.end();
}));
