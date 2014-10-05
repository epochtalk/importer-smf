var path = require('path');
var through2 = require('through2');
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var querier = mQ.getQuerier(function(err) {
  var categoryStream = epochStream.createCategoryStream(querier);

  categoryStream.pipe(through2.obj(function (data, enc, cb) {
    console.log('test: ');
    console.log(data);
    cb();
  },
  function() {
    querier.release();
    mQ.end();
  }));
});
