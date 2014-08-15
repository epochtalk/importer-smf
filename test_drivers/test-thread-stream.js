var path = require('path');
var through2 = require('through2');
var epochThreadStream = require(path.join(__dirname, '..', 'epoch_stream', 'thread-stream'));
var mysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier', 'mysql-querier'));
var mQConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
var mQ = mysqlQuerier(mQConfig);

var ets = epochThreadStream(mQ);
var threadStream = ets.createThreadStream(null, 86, 0);

var tr = through2.obj(function (data, enc, cb) {
  console.log('test: ');
  console.log(data);
  return cb();
},
function () {
  mQ.end();
});

threadStream.pipe(tr);
