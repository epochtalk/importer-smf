module.exports = function smfImport(args, topCallback) {
  var debug = args.debug;
  var leveldbPath= args.db;

  var path = require('path');
  var through2 = require('through2');
  var epochStream = require(path.join(__dirname, 'epoch_stream'));
  var core = require('epochcore')(leveldbPath);
  var MysqlQuerier = require(path.join(__dirname, 'mysql_querier'));
  var mQConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  var mQ = new MysqlQuerier(mQConfig, function(err) {
    if (err) {
      return topCallback(err);
    }
  });

  var async = require('async');
  var concurrency = Number.MAX_VALUE; // Concurrency handled by lolipop

  var asyncQueue = async.queue(function(runTask, callback) {
    runTask(callback);
  }, concurrency);

  asyncQueue.drain = function() {
    mQ.end(function() {
      if (debug) {
        console.log('Import complete.');
      }
      topCallback();
    });
  }

  asyncQueue.push(function(asyncUserCb) {
    var userStream = epochStream.createUserStream(mQ);

    userStream.pipe(through2.obj(function(userObject, enc, trUserCb) {
      core.users.import(userObject)
      .then(function(newUser) {
        if (debug) {
          console.log(newUser);
        }
        trUserCb();  // Don't return.  Async will handle end.
      })
      .catch(function(err) {
        console.log("ERROR");
        console.log(err);
        trUserCb();
      });
    }, asyncUserCb));  // When stream is empty, worker is done
  });
}
