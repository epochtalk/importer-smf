var path = require('path');
var through2 = require('through2');
var args = require(path.join(__dirname, '..', 'args'));
var db = require(path.join(__dirname, '..', 'db'));

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

  // "deleted" user
  db.users.import({
    username: 'deleted',
    email: 'deleted',
    smf: {
      ID_MEMBER: -1
    }
  })
  .catch(function(err) {
    console.log('"deleted" user error:');
    console.log(err);
  });

  var userStream = epochStream.createUserStream(mQ);
  userStream.pipe(through2.obj(function(userObject, enc, trCb) {
    db.users.import(userObject)
    .then(function(newUser) {
      if (handler) {
        handler(null, newUser, trCb);
      }
      else {
        trCb();
      }
    })
    .catch(function(err){
      if (handler) {
        handler(err, userObject, trCb);
      }
      else {
        trCb();
      }
    });
  }, function() {
    mQ.end();
    callback();
  }));
};
