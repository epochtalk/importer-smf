var path = require('path');
var through2 = require('through2');
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
var mysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
var mQConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
var mQ = mysqlQuerier(mQConfig);

var boardStream = epochStream.createBoardStream(mQ);

boardStream.pipe(through2.obj(function (data, enc, cb) {
  console.log('test: ');
  console.log(data);
  return cb();
},
function() {
  mQ.end();
}));
