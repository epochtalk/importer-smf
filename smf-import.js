module.exports = function smfImport(args, topCallback) { var debug = args.debug;
  var verbose = args.verbose;
  var color = args.color;
  var users = args.users;
  var forum = args.forum;
  var save = color === 'crazy';
  var leveldbPath= args.db;
  var logfile = args.log;

  var rw = require('rainbow-word');
  var rainbow = rw.pattern({
    style: 'bold',
    save: save
  });
  var path = require('path');

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
  var importBoards = require(path.join(__dirname,'epoch_importer','import-boards'));
  var userImporter = function(asyncSeriesCb) {
    importUsers(args, asyncSeriesCb);
  };

  var forumImport = function(asyncSeriesCb) {
    importBoards(args, asyncSeriesCb);
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
      if (verbose) {
        process.stdout.write('\n');
      }
      topCallback();
    }
  );
};
