var path = require('path');
var userImporter = require(path.join(__dirname, '..', 'user-import'));
var debugArg = process.argv[2] === '-d';

userImporter({debug: debugArg, db: path.join(process.env.PWD, 'epoch.db')}, function(error) {
  console.log(error || 'done');
});
