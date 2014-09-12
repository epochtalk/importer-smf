module.exports = function smfImport(args, topCallback) {
  var debug = args.debug;
  var verbose = args.verbose;
  var color = args.color;
  var save = color === 'crazy';
  var leveldbPath= args.db;

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
  var mQConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  var mQ = new MysqlQuerier(mQConfig, function(err) {
    if (err) {
      console.log('error out');
      return topCallback(err);
    }
  });

  var async = require('async');
  var concurrency = 100;
  var uIC = 0;
  var bIC = 0;
  var tIC = 0;
  var pIC = 0;

  var printStats = function(userCount, boardCount, threadCount, postCount) {
    if (color) {
      process.stdout.write(rainbow.convert(
        'users: ', userCount + ' ',
        'boards: ', boardCount + ' ',
        'threads: ', threadCount + ' ',
        'posts: ', postCount + '\r'
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
    mQ.end(function() {
      if (debug) {
        process.stdout.write('\n');
      }
      topCallback();
    });
  }

  async.series([
    function(asyncSeriesCb) {
      asyncQueue.push(function(asyncUserCb) {
        var userStream = epochStream.createUserStream(mQ);

        userStream.pipe(through2.obj(function(userObject, enc, trUserCb) {
          core.users.import(userObject)
          .then(function(newUser) {
            uIC++;
            if (debug) {
              printStats(uIC, bIC, tIC, pIC);
            }
            trUserCb();  // Don't return.  Async will handle end.
          })
          .catch(function(err) {
            if (verbose) {
              console.log("ERROR");
              console.log(err);
            }
            trUserCb();
          });
        }, asyncUserCb));  // When stream is empty, worker is done
      }, asyncSeriesCb);
    }
  ],
  function(err, results) {
    asyncQueue.push(function(asyncBoardCb) {

      var boardStream = epochStream.createBoardStream(mQ);

      boardStream.pipe(through2.obj(function(boardObject, enc, trBoardCb) {
        core.boards.import(boardObject)
        .then(function(newBoard) {
          bIC++;
          if (debug) {
            printStats(uIC, bIC, tIC, pIC);
          }
          trBoardCb();  // Don't return.  Async will handle end.

          asyncQueue.push(function(asyncThreadCb) {

            var oldBoardId = newBoard.smf.ID_BOARD;
            /*
            if (debug) {
              console.log('boardId: '+oldBoardId);
            }
            */
            var newBoardId = newBoard.id;
            var threadStream = epochStream.createThreadStream(mQ, oldBoardId, newBoardId);

            threadStream.pipe(through2.obj(function(threadObject, enc, trThreadCb) {
              core.threads.import(threadObject)
              .then(function(newThread) {
                tIC++;
                if (debug) {
                  printStats(uIC, bIC, tIC, pIC);
                }
                trThreadCb();  // Don't return.  Async will handle end.

                asyncQueue.push(function(asyncPostCb) {

                  var oldThreadId = newThread.smf.ID_TOPIC;
                  /*
                  if (debug) {
                    console.log('threadId: '+oldThreadId);
                  }
                  */
                  var newThreadId = newThread.id;
                  var postStream = epochStream.createPostStream(mQ, oldThreadId, newThreadId);

                  postStream.pipe(through2.obj(function(postObject, enc, trPostCb) {
                    core.posts.import(postObject)
                    .then(function(newPost) {
                      pIC++;
                      if (debug) {
                        printStats(uIC, bIC, tIC, pIC);
                      }
                      trPostCb();  // Don't return.  Async will handle end.

                      /*
                      if (debug) {
                        console.log('postId: '+newPost.smf.ID_MSG);
                      }
                      */
                    })
                    .catch(function(err) {
                      if (verbose) {
                        console.log('Post Error:');
                        console.log(err);
                      }
                      trPostCb();
                    });
                  }, asyncPostCb));  // When stream is empty, worker is done
                });
              })
              .catch(function(err) { // Catch core.threads.import
                if (verbose) {
                  console.log('Thread Error:');
                  console.log(err);
                }
                trThreadCb();
              });
            }, asyncThreadCb));  // When stream is empty, worker is done
          });
        })
        .catch(function(err) {
          if (verbose) {
            console.log('Board Error:');
            console.log(err);
          }
          trBoardCb();
        });
      }, asyncBoardCb));  // When stream is empty, worker is done
    });
  });
}
