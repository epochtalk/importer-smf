var path = require('path');
var smfImporter = require(path.join(__dirname, '..', 'smf-import'));
var debugArg = process.argv[2] === '-d';
var config = {
  debug: debugArg,
  color: true,
  verbose: false,
  db: path.join(process.env.PWD, 'epoch.db')
};

smfImporter(config, function(err) {
  console.log(err || 'done');
});
