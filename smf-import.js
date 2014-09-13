module.exports = function smfImport(args, topCallback) { var debug = args.debug;
  var verbose = args.verbose;
  var color = args.color;
  var users = args.users;
  var forum = args.forum;
  var save = color === 'crazy';
  var leveldbPath= args.db;
  var logfile = args.log;

  if (logfile) {
    var fs = require('fs');
    var log = fs.createWriteStream(logfile);
  }
  var rw = require('rainbow-word');
  var rainbow = rw.pattern({
    style: 'bold',
    save: save
  });
  var path = require('path');
  var through2 = require('through2');
  var epochStream = require(path.join(__dirname, 'epoch_stream'));
  var core = require('epochcore')(leveldbPath);
  var MysqlQuerier = require(path.join(__dirname, 'mysql_querier'));
  var boardCfg;
  boardCfg = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  boardCfg.connectionLimit = 1;
  var boardMQ = new MysqlQuerier(boardCfg, function(err) {
    if (err) {
      console.log('Board Connection Error');
      return topCallback(err);
    }
  });

  var async = require('async');
  var concurrency = Number.MAX_VALUE;
  var uIC = 0;
  var bIC = 0;
  var tIC = 0;
  var pIC = 0;
  var eIC = 0;

  var printStats = function(userCount, boardCount, threadCount, postCount, errorCount) {
    if (color) {
      process.stdout.write(rainbow.convert(
        'users: ', userCount + ' ',
        'boards: ', boardCount + ' ',
        'threads: ', threadCount + ' ',
        'posts: ', postCount + ' ',
        'errors: ', errorCount + '\r'
      ));
    }
    else {
      process.stdout.write('users: ' + userCount + ' boards: ' + boardCount +
          ' threads: ' + threadCount + ' posts: ' + postCount + '\r');
    }
  };

  var importUsers = require(path.join(__dirname,'epoch_importer','import-users'));
  var importThreads = require(path.join(__dirname,'epoch_importer','import-threads'));
  var userImporter = function(asyncSeriesCb) {
    importUsers(args, asyncSeriesCb);
  };

  var forumImport = function(asyncSeriesCb) {
    var boardStream = epochStream.createBoardStream(boardMQ);

    boardStream.pipe(through2.obj(function(boardObject, enc, trBoardCb) {
      core.boards.import(boardObject)
      .then(function(newBoard) {
        importThreads(args, newBoard, trBoardCb);
      })
      .catch(function(err) {
        if (verbose) {
          eIC++;
          printStats(uIC, bIC, tIC, pIC, eIC);
        }
        if (logfile) {
          log.write('Board Error:\n');
          log.write(err.toString()+'\n');
        }
        trBoardCb();
      });
    }, asyncSeriesCb));  // When stream is empty, worker is done
  };
  var importers = [];
  if (users) {
    importers.push(userImporter);
  }
  else if (forum) {
    importers.push(forumImport);
  }
  else {
    importers.push(userImporter);
    importers.push(forumImport);
  }

  async.series(importers,
    function() {
      boardMQ.end();
      if (verbose) {
        process.stdout.write('\n');
      }
      topCallback();
    }
  );
}
