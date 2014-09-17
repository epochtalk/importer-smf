var path = require('path');
var through2 = require('through2');

module.exports = function(options, handler, callback) {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  var callback = args.pop();
  var handler = args.pop();
  var dbPath = options.db;

  var mysqlConfig = options.mQConfig;
  // TODO: remove this?
  mysqlConfig.connectionLimit = 1;

  var core = require('epochcore')(dbPath);
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      console.log('User Connection Error');
      return callback(err);
    }
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
        handler(err, null, trCb);
      }
      else {
        trCb();
      }
    });
  }, callback));
};
