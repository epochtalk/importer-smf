module.exports = function smfImport(args, topCallback) {
  var debug = args.debug;
  var verbose = args.verbose;
  var users = args.users;
  var forum = args.forum;

  var path = require('path');
  var importUsers = require(path.join(__dirname,'epoch_importer','import-users'));
  var importBoards = require(path.join(__dirname,'epoch_importer','import-boards'));

  if (users) {
    importUsers(args, function(){
      if (verbose) {
        process.stdout.write('\n');
      }
      topCallback();
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
