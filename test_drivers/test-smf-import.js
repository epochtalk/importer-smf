var path = require('path');
var smfImporter = require(path.join(__dirname, '..', 'smf-import'));
var debugArg = process.argv[2] === '-d';

smfImporter({debug: debugArg, db: path.join(process.env.PWD, 'epoch.db')}, function(err) {
  console.log(err || 'done');
});
