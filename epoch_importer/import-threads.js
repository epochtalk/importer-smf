var path = require('path');
module.exports = function(args, newBoard, callback) {
  var importPosts = require(path.join(__dirname, 'import-posts'));
  var oldBoardId = newBoard.smf.ID_BOARD;
  var newBoardId = newBoard.id;
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mysqlConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  mysqlConfig.connectionLimit = 5;
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      console.log('Thread Connection Error');
      return callback(err);
    }
  });
  var Importer = require(path.join(__dirname, 'importer'));
  var importer = new Importer(args, 'threads', importPosts, function() {
    process.stdout.write('\n');
    mQ.end();
    callback();
  });
  var threadStream = epochStream.createThreadStream(mQ, oldBoardId, newBoardId);
  threadStream.pipe(importer);  // When stream is empty, worker is done
};
