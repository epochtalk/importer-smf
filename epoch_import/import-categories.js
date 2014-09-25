var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));

module.exports = function(handler, callback) {
  var mysqlConfig = args.mysqlConfig;
  mysqlConfig.connectionLimit = 1;

  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      return callback(err);
    }
  });

  var categoryStream = epochStream.createCategoryStream(mQ);
  categoryStream.pipe(through2.obj(function(categoryObject, enc, trCb) {
    handler(null, categoryObject, trCb);
  }, function() {
    mQ.end();
    callback();
  }));
};
