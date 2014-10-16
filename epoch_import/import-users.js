var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var mQ = require(path.join(__dirname, '..', 'mq'));
var db = require(path.join(__dirname, '..', 'db'));
var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));

module.exports = function(handler, callback) {
  var querier = mQ.getQuerier(function(err) {
    if (err) {
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
      db.store(userObject, function(err, newUser) {
        if (handler) {
          if (err) {
            handler(err, userObject, trCb);
          }
          else {
            handler(err, newUser, trCb);
          }
        }
        else {
          trCb();
        }
      });
    }, function() {
      querier.release();
      callback();
    }));
  });
};
