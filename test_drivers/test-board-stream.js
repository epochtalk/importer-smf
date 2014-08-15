var path = require('path');
var through2 = require('through2');
var epochBoardStream = require(path.join(__dirname, '..', 'epoch_stream', 'board-stream'));
var mysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier', 'mysql-querier'));
var mQConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
var mQ = mysqlQuerier(mQConfig);

var ebs = epochBoardStream(mQ);
var boardStream = ebs.createBoardStream(null);

var tr = through2.obj(function (data, enc, cb) {
  console.log('test: ');
  console.log(data);
  return cb();
},
function() {
  mQ.end();
});

boardStream.pipe(tr);
