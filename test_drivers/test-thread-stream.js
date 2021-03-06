var path = require('path');
var through2 = require('through2');
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var querier = mQ.getQuerier(function(err) {
  if (err) {
    console.log('ERRROR!');
    console.log(err);
  }
  var otherQuerier = mQ.getQuerier(function(err) {
    var threadStream = epochStream.createThreadStream(querier, otherQuerier, 1, 0);

    threadStream.pipe(through2.obj(function (data, enc, cb) {
      console.log('test: ');
      console.log(data);
      return cb();
    },
    function () {
      querier.release();
      mQ.end();
    }));
  });
});
