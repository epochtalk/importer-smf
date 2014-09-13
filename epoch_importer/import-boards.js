var path = require('path');
module.exports = function(args, callback) {
  var importThreads = require(path.join(__dirname, 'import-threads'));
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mysqlConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  mysqlConfig.connectionLimit = 5;
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      console.log('Board Connection Error');
      return callback(err);
    }
  });
  var Importer = require(path.join(__dirname, 'importer'));
  var importer = new Importer(args, 'boards', importThreads, function() {
    process.stdout.write('\n');
    mQ.end();
    callback();
  });
  var boardStream = epochStream.createBoardStream(mQ);
  boardStream.pipe(importer);  // When stream is empty, worker is done
};
