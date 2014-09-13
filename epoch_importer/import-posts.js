var path = require('path');
module.exports = function(args, newThread, callback) {
  args.importType = 'posts';
  var oldThreadId = newThread.smf.ID_TOPIC;
  var newThreadId = newThread.id;
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mysqlConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  mysqlConfig.connectionLimit = 10;
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      console.log('Post Connection Error');
      return callback(err);
    }
  });
  var Importer = require(path.join(__dirname, 'importer'));
  var importer = new Importer(args, function() {
    process.stdout.write('\n');
    mQ.end();
    callback();
  });
  var postStream = epochStream.createPostStream(mQ, oldThreadId, newThreadId);
  postStream.pipe(importer);  // When stream is empty, worker is done
};
