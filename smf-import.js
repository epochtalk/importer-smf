var path = require('path');
var db = require(path.join(__dirname, 'db'));

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

  var epochImport = require(path.join(__dirname,'epoch_import'));
  var StatLogger = require('./stat-logger');
  var statFields = ['users', 'boards', 'threads', 'posts', 'errors'];
  var statLogger = new StatLogger({fields: statFields});

  var categories = [];
  var existingCats;
  db.boards.allCategories().then(function(cats) {
    existingCats = cats;
  });
  var categoryMap = {};

  epochImport.categories(function(err, newCategory, categoryCb) {
    if(err) {
      statLogger.increment('errors');
      if (log) {
        logfile.write('Category error: ' + newCategory.smf.ID_CAT + '\n');
        logfile.write(err.toString()+'\n');
      }
    }
    // TODO Categories: Update this implementation
    categories.push({name: newCategory.name, board_ids: []});
    categoryMap[newCategory.smf.ID_CAT.toString()] = categories.length - 1;
    categoryCb();
  }, function () {
    epochImport.users(function(err, newUser, userCb) {
      if(err) {
        statLogger.increment('errors');
        if (log) {
          logfile.write('User error: ' + newUser.smf.ID_MEMBER + '\n');
          logfile.write(err.toString()+'\n');
        }
      }
      else {
        if (debug) {
          console.log('User: ' + newUser.smf.ID_MEMBER);
        }
        if (!quiet) {
          statLogger.increment('users');
        }
      }
      return userCb();
    },
    function() {
      epochImport.boards(function(err, newBoard, boardCb) {
        if(err) {
          statLogger.increment('errors');
          if (log) {
            logfile.write('Board error: ' + newBoard.smf.ID_BOARD + '\n');
            logfile.write(err.toString()+'\n');
          }
          return boardCb();
        }
        else {
          if (debug) {
            console.log('Board: ' + newBoard.smf.ID_BOARD);
          }
          if (!quiet) {
            statLogger.increment('boards');
          }
          // TODO Categories: Clean this up in updated implementation
          if (newBoard.smf.ID_CAT !== 0) {
            categories[categoryMap[newBoard.smf.ID_CAT.toString()]].board_ids.push(newBoard.id);
          }
          epochImport.threads(newBoard, function(err, newThread, threadCb) {
            if(err) {
              statLogger.increment('errors');
              if (log) {
                logfile.write('Thread error: ' + newThread.smf.ID_TOPIC + '\n');
                logfile.write(err.toString()+'\n');
              }
              return threadCb();
            }
            else {
              if (debug) {
                console.log('Thread: ' + newThread.smf.ID_TOPIC);
              }
              if (!quiet) {
                statLogger.increment('threads');
              }
              epochImport.posts(newThread, function(err, newPost, postCb) {
                if(err) {
                  statLogger.increment('errors');
                  if (log) {
                    logfile.write('Post error: ' + newPost.smf.ID_MSG + '\n');
                    logfile.write(err.toString()+'\n');
                  }
                }
                else {
                  if (debug) {
                    console.log('Post: ' + newPost.smf.ID_MSG);
                  }
                  if (!quiet) {
                    statLogger.increment('posts');
                  }
                }
                return postCb();
              }, threadCb);
            }
          }, boardCb);

        }
      },
      function() {
        if (!quiet) {
          process.stdout.write('\n');
        }
        db.boards.updateCategories(existingCats.concat(categories)).catch(console.log);
      });
    });
  });
};
