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
      console.log('error out');
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

  async.series([
      function(asyncSeriesCb) {
        asyncQueue.push(function(asyncUserCb) {
          var userStream = epochStream.createUserStream(mQ);

          userStream.pipe(through2.obj(function(userObject, enc, trUserCb) {
            core.users.import(userObject)
            .then(function(newUser) {
              if (debug) {
                console.log(newUser.id);
              }
              trUserCb();  // Don't return.  Async will handle end.
            })
          .catch(function(err) {
            console.log("ERROR");
            console.log(err);
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
          trBoardCb();  // Don't return.  Async will handle end.

          asyncQueue.push(function(asyncThreadCb) {

            var oldBoardId = newBoard.smf.ID_BOARD;
            if (debug) {
              console.log('boardId: '+oldBoardId);
            }
            var newBoardId = newBoard.id;
            var threadStream = epochStream.createThreadStream(mQ, oldBoardId, newBoardId);

            threadStream.pipe(through2.obj(function(threadObject, enc, trThreadCb) {
              core.threads.import(threadObject)
              .then(function(newThread) {
                trThreadCb();  // Don't return.  Async will handle end.

                asyncQueue.push(function(asyncPostCb) {

                  var oldThreadId = newThread.smf.ID_TOPIC;
                  if (debug) {
                    console.log('threadId: '+oldThreadId);
                  }
                  var newThreadId = newThread.id;
                  var postStream = epochStream.createPostStream(mQ, oldThreadId, newThreadId);

                  postStream.pipe(through2.obj(function(postObject, enc, trPostCb) {
                    core.posts.import(postObject)
                    .then(function(newPost) {
                      trPostCb();  // Don't return.  Async will handle end.

                      if (debug) {
                        console.log('postId: '+newPost.smf.ID_MSG);
                      }
                    })
                  .catch(function(err) {
                    console.log('Post Error:');
                    console.log(err);
                    trPostCb();
                  });
                  }, asyncPostCb));  // When stream is empty, worker is done
                });
              })
            .catch(function(err) { // Catch core.threads.import
              console.log('Thread Error:');
              console.log(err);
              trThreadCb();
            });
            }, asyncThreadCb));  // When stream is empty, worker is done
          });
        })
      .catch(function(err) {
        console.log('Board Error:');
        console.log(err);
        trBoardCb();
      });
      }, asyncBoardCb));  // When stream is empty, worker is done
    });
  });
}
