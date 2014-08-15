var path = require('path');
var through2 = require('through2');
var epochPostStream = require(path.join(__dirname, '..', 'epoch_stream', 'post-stream'));
var mysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier', 'mysql-querier'));
var mQConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
var mQ = mysqlQuerier(mQConfig);

var eps = epochPostStream(mQ);
var postStream = eps.createPostStream(null, 5, 0);

var tr = through2.obj(function (data, enc, cb) {
  console.log('test: ');
  console.log(data);
  return cb();
},
function () {
  mQ.end();
});

postStream.pipe(tr);
