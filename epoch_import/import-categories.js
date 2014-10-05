var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));

module.exports = function(handler, callback) {
  var querier = mQ.getQuerier(function(err) {
    if (err) {
      return callback(err);
    }
    var categoryStream = epochStream.createCategoryStream(querier);
    categoryStream.pipe(through2.obj(function(categoryObject, enc, trCb) {
      handler(null, categoryObject, trCb);
    }, function() {
      querier.release();
      return callback();
    }));
  });
};
