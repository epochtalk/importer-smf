module.exports = function smfImport(args, topCallback) {
  var debug = args.debug;
  var quiet = args.quiet;
  var users = args.users;
  var forum = args.forum;
  var log = args.log;
  if (log) {
    var fs = require('fs');
    var logfile = fs.createWriteStream(log);
  }

  var path = require('path');
  var epochImport = require(path.join(__dirname,'epoch_import'));
  var rw = require('rainbow-word');
  var rainbow = rw.pattern({
    style: 'bold',
      save: false
  });
  var printStats = function(count) {
    process.stdout.write(rainbow.convert(
      'users: ', count.users + ' ',
      'boards: ', count.boards + ' ',
      'threads: ', count.threads + ' ',
      'posts: ', count.posts + ' ',
      'errors: ', count.errs + '\r'
    ));
  };

  var count = {
    users: 0,
    boards: 0,
    threads: 0,
    posts: 0,
    errs: 0
  };

  var options = {
    db: args.db,
    mQConfig: require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'))
  };


  epochImport.users(options, function(err, newUser, userCb) {
    if(err) {
      count.errs++;
      if (log) {
        logfile.write('User error:\n');
        logfile.write(err.toString()+'\n');
      }
    }
    else {
      if (debug) {
        console.log('User: ' + newUser.smf.ID_MEMBER);
      }
      count.users++;
    }
    if (!quiet) {
      printStats(count);
    }
    return userCb();
  },
  function() {
    epochImport.boards(options, function(err, newBoard, boardCb) {
      if(err) {
        count.errs++;
        if (log) {
          logfile.write('Board error:\n');
          logfile.write(err.toString()+'\n');
        }
        return boardCb();
      }
      else {
        if (debug) {
          console.log('Board: ' + newBoard.smf.ID_BOARD);
        }
        count.boards++;
        epochImport.threads(options, newBoard, function(err, newThread, threadCb) {
          if(err) {
            count.errs++;
            if (log) {
              logfile.write('Thread error:\n');
              logfile.write(err.toString()+'\n');
            }
            return threadCb();
          }
          else {
            if (debug) {
              console.log('Thread: ' + newThread.smf.ID_TOPIC);
            }
            count.threads++;
            epochImport.posts(options, newThread, function(err, newPost, postCb) {
              if(err) {
                count.errs++;
                if (log) {
                  logfile.write('Post error:\n');
                  logfile.write(err.toString()+'\n');
                }
              }
              else {
                if (debug) {
                  console.log('Post: ' + newPost.smf.ID_MSG);
                }
                count.posts++;
              }
              if (!quiet) {
                printStats(count);
              }
              return postCb();
            }, threadCb);
          }
          if (!quiet) {
            printStats(count);
          }
        }, boardCb);

      }
      if (!quiet) {
        printStats(count);
      }
    },
    function() {
      if (!quiet) {
        process.stdout.write('\n');
      }
    });
  });
};
