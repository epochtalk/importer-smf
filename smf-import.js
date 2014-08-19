module.exports = function smfImport(args, topCallback) {
  var debug = args.debug;
  var leveldbPath= args.db;

  var path = require('path');
  var through2 = require('through2');
  var epochStream = require(path.join(__dirname, 'epoch_stream'));
  var core = require('epochcore')(leveldbPath);
  var mysqlQuerier = require(path.join(__dirname, 'mysql_querier'));
  var mQConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
  var mQ = mysqlQuerier(mQConfig);

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

  asyncQueue.push(function(asyncBoardCb) {

    var boardStream = epochStream.createBoardStream(mQ);

    boardStream.pipe(through2.obj(function(boardObject, enc, trBoardCb) {
      core.boards.import(boardObject)
      .then(function(newBoard) {
        trBoardCb();  // Don't return.  Async will handle end.

        asyncQueue.push(function(asyncThreadCb) {

          var oldBoardId = newBoard.smf.board_id;
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

                var oldThreadId = newThread.smf.thread_id;
                if (debug) {
                  console.log('threadId: '+oldThreadId);
                }
                var newThreadId = newThread.thread_id;
                var firstPostId = newThread.smf.post_id;
                var postStream = epochStream.createPostStream(mQ, oldThreadId, newThreadId);

                postStream.pipe(through2.obj(function(postObject, enc, trPostCb) {
                  if (postObject.smf.post_id === firstPostId) {
                    return trPostCb();  // Don't return.  Async will handle end.
                  }
                  else {
                    core.posts.import(postObject)
                  .then(function(newPost) {
                    trPostCb();  // Don't return.  Async will handle end.

                    if (debug) {
                      console.log('postId: '+newPost.smf.post_id);
                    }
                  })
                .catch(function(err) {
                  console.log(err);
                });
                  }
                }, asyncPostCb));  // When stream is empty, worker is done
              });
            })
          .catch(function(err) { // Catch core.threads.import
            console.log(err);
          });
          }, asyncThreadCb));  // When stream is empty, worker is done
        });
      })
    .catch(function(err) {
      console.log(err);
    });
    }, asyncBoardCb));  // When stream is empty, worker is done
  });
}
