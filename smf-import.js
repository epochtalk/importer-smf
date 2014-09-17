module.exports = function smfImport(args, topCallback) {
  var debug = args.debug;
  var quiet = args.quiet;
  var verbose = args.verbose;
  var users = args.users;
  var forum = args.forum;

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
    dbPath: args.db,
    mQConfig: require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'))
  };


  if (users) {
    epochImport.users(options, function(err, newUser, callback){
      if (!quiet) {
        if(err) {
          count.errs++;
        }
        else {
          count.users++;
        }
        printStats(count);
      }
      return callback();
    },
    function() {
      if (!quiet) {
        process.stdout.write('\n');
      }
    });
  }
  else if (forum) {
    importBoards(args, function(){
      if (verbose) {
        process.stdout.write('\n');
      }
      topCallback();
    });
  }
  else {
    importUsers(args, function() {
      importBoards(args, function(){
        if (verbose) {
          process.stdout.write('\n');
        }
        topCallback();
      });
    });
  }
};
