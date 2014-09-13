module.exports = function(args, callback) {
  var path = require('path');
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mysqlConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  mysqlConfig.connectionLimit = 1;
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      console.log('User Connection Error');
      return callback(err);
    }
  });
  var Importer = require(path.join(__dirname, 'importer'));
  var importer = new Importer(args, 'users', function() {
    process.stdout.write('\n');
    mQ.end();
    callback();
  });
  var userStream = epochStream.createUserStream(mQ);
  userStream.pipe(importer);  // When stream is empty, worker is done
};
