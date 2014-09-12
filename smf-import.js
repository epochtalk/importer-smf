module.exports = function smfImport(args, topCallback) {
  var debug = args.debug;
  var verbose = args.verbose;
  var color = args.color;
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
  var threadCfg;
  var postCfg;
  var userCfg;
  userCfg = boardCfg = threadCfg = postCfg = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  userCfg.connectionLimit = 1;
  boardCfg.connectionLimit = 1;
  threadCfg.connectionLimit = 10;
  postCfg.connectionLimit = 100;
  var userMQ = new MysqlQuerier(userCfg, function(err) {
    if (err) {
      console.log('User Connection Error');
      return topCallback(err);
    }
  });
  var boardMQ = new MysqlQuerier(boardCfg, function(err) {
    if (err) {
      console.log('Board Connection Error');
      return topCallback(err);
    }
  });
  var threadMQ = new MysqlQuerier(threadCfg, function(err) {
    if (err) {
      console.log('Thread Connection Error');
      return topCallback(err);
    }
  });
  var postMQ = new MysqlQuerier(postCfg, function(err) {
    if (err) {
      console.log('Post Connection Error');
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

  var asyncQueue = async.queue(function(runTask, callback) {
    runTask(callback);
  }, concurrency);

  asyncQueue.drain = function() {
    userMQ.end();
    boardMQ.end();
    threadMQ.end();
    postMQ.end();
    if (debug) {
      process.stdout.write('\n');
    }
    topCallback();
  }

  var userImport = function(asyncSeriesCb) {
    asyncQueue.push(function(asyncUserCb) {
      var userStream = epochStream.createUserStream(userMQ);
      userStream.pipe(through2.obj(function(userObject, enc, trUserCb) {
        core.users.import(userObject)
        .then(function(newUser) {
          if (debug) {
            uIC++;
            printStats(uIC, bIC, tIC, pIC, eIC);
          }
          trUserCb();  // Don't return.  Async will handle end.
        })
        .catch(function(err) {
          if (debug) {
            eIC++;
            printStats(uIC, bIC, tIC, pIC, eIC);
          }
          if (logfile) {
            log.write('User Error:\n');
            log.write(err.toString()+'\n');
          }
          trUserCb();
        });
      }, asyncUserCb));  // When stream is empty, worker is done
    }, asyncSeriesCb);
  }
  var forumImport = function(err, results) {
    asyncQueue.push(function(asyncBoardCb) {

      var boardStream = epochStream.createBoardStream(boardMQ);

      boardStream.pipe(through2.obj(function(boardObject, enc, trBoardCb) {
        core.boards.import(boardObject)
        .then(function(newBoard) {
          asyncQueue.push(function(asyncThreadCb) {

            var oldBoardId = newBoard.smf.ID_BOARD;
            var newBoardId = newBoard.id;
            var threadStream = epochStream.createThreadStream(threadMQ, oldBoardId, newBoardId);
            threadStream.pipe(through2.obj(function(threadObject, enc, trThreadCb) {
              core.threads.import(threadObject)
              .then(function(newThread) {
                asyncQueue.push(function(asyncPostCb) {

                  var oldThreadId = newThread.smf.ID_TOPIC;
                  var newThreadId = newThread.id;
                  var postStream = epochStream.createPostStream(postMQ, oldThreadId, newThreadId);

                  postStream.pipe(through2.obj(function(postObject, enc, trPostCb) {
                    core.posts.import(postObject)
                    .then(function(newPost) {
                      if (debug) {
                        pIC++;
                        printStats(uIC, bIC, tIC, pIC, eIC);
                      }
                      trPostCb();  // Don't return.  Async will handle end.
                    })
                    .catch(function(err) {
                      if (debug) {
                        eIC++;
                        printStats(uIC, bIC, tIC, pIC, eIC);
                      }
                      if (logfile) {
                        log.write('Post Error:\n');
                        log.write(err.toString()+'\n');
                      }
                      trPostCb();
                    });
                  }, function() {
                    asyncPostCb();
                    if (debug) {
                      tIC++;
                      printStats(uIC, bIC, tIC, pIC, eIC);
                    }
                    trThreadCb();  // Don't return.  Async will handle end.
                  }));  // When stream is empty, worker is done
                });
              })
              .catch(function(err) { // Catch core.threads.import
                if (verbose) {
                  if (debug) {
                    eIC++;
                    printStats(uIC, bIC, tIC, pIC, eIC);
                  }
                  if (logfile) {
                    log.write('Thread Error:\n');
                    log.write(err.toString()+'\n');
                  }
                }
                trThreadCb();
              });
            }, function() {
              asyncThreadCb();
              if (debug) {
                bIC++;
                printStats(uIC, bIC, tIC, pIC, eIC);
              }
              trBoardCb();  // Don't return.  Async will handle end.
            }));  // When stream is empty, worker is done
          });
        })
        .catch(function(err) {
          if (debug) {
            eIC++;
            printStats(uIC, bIC, tIC, pIC, eIC);
          }
          if (logfile) {
            log.write('Board Error:\n');
            log.write(err.toString()+'\n');
          }
          trBoardCb();
        });
      }, asyncBoardCb));  // When stream is empty, worker is done
    });
  }

  async.series([userImport, forumImport]);
}
