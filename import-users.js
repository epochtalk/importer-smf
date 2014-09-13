module.exports = function(args, callback) {
  args.importType = 'users';
  var path = require('path');
  var epochStream = require(path.join(__dirname, 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, 'mysql_querier'));
  var importer = require(path.join(__dirname, 'importer'));
  var mysqlConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  mysqlConfig.connectionLimit = 1;
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      console.log('User Connection Error');
      return callback(err);
    }
  });
  var userStream = epochStream.createUserStream(mQ);
  userStream.pipe(importer(args, function() {
    mQ.end();
    callback();
  }));  // When stream is empty, worker is done
};
