var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var db = require(path.join(__dirname, '..', 'db'));
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
var logfile = require(path.join(__dirname, '..', 'log'));
var statLogger = require(path.join(__dirname, '..', 'stats'));

module.exports = function(callback) {
  var querier = mQ.getQuerier(function(err) {
    if (err) {
      statLogger.increment('errors');
      logfile.write('Category connection:');
      logfile.write(err.toString());
      return callback(err);
    }
    var categoryStream = epochStream.createCategoryStream(querier);
    categoryStream.pipe(through2.obj(function(categoryObject, enc, trCb) {
      db.store(categoryObject, function(err, newCategory) {
        if (err) {
          statLogger.increment('errors');
          logfile.write('Category: ' + categoryObject.smf.ID_CAT + '\n');
          logfile.write(err.toString() + '\n');
        }
        else {
          statLogger.increment('categories');
        }
        return trCb();
      });
    }, function() {
      statLogger.tag('categories', '(finished)');
      querier.release();
      return callback(null, 'Category import succeded');
    }));
  });
};
