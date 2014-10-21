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
      logfile.write('User connection:');
      logfile.write(err.toString());
      return callback(err);
    }
    // "deleted" user
    db.store({
      username: 'deleted',
      email: 'deleted',
      smf: {
        ID_MEMBER: -1
      }
    }, function(err, val) {
      if (err) {
        return callback(err);
      }
    });

    var userStream = epochStream.createUserStream(querier);
    userStream.pipe(through2.obj(function(userObject, enc, trCb) {
      trCb();
      db.store(userObject, function(err, newUser) {
        if (err) {
          statLogger.increment('errors');
          logfile.write('User: ' + userObject.smf.ID_MEMBER + '\n');
          logfile.write(err.toString() + '\n');
        }
        else {
          statLogger.increment('users');
        }
      });
    }, function() {
      statLogger.tag('users', '(finished)');
      querier.release();
      return callback(null, 'User import succeded');
    }));
  });
};
