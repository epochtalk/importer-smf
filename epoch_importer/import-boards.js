var path = require('path');
var through2 = require('through2');

module.exports = function(options, handler, callback) {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  var callback = args.pop();
  var handler = args.pop();
  var dbPath = options.db();

  // TODO: move || to top level
  var mysqlConfig = options.mQConfig() || require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  // TODO: remove this?
  mysqlConfig.connectionLimit = 5;

  var core = require('epochcore')(dbPath);
  var epochStream = require(path.join(__dirname, '..', 'epoch_stream'));
  var MysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
  var mQ = new MysqlQuerier(mysqlConfig, function(err) {
    if (err) {
      console.log('Board Connection Error');
      return callback(err);
    }
  });
  var boardStream = epochStream.createBoardStream(mQ);
  boardStream.pipe(through2.obj(function(boardObject, enc, trCb) {
    core.boards.import(boardObject)
    .then(function(newBoard) {
      if (handler) {
        handler(null, newBoard, trCb);
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
