var path = require('path');
var through2 = require('through2');

module.exports = function(options, handler, callback) {
  var dbPath = options.db;

  var mysqlConfig = options.mQConfig;
  // TODO: remove this?
  mysqlConfig.connectionLimit = 1;

  var core = require('epochcore')(dbPath);
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      return callback(err);
    }
  });

  // "deleted" user
  core.users.import({
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
    core.users.import(userObject)
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
