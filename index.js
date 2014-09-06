var path = require('path');
var pJSON = require(path.join(__dirname, 'package.json'));
var program = require('commander');

program
  .version(pJSON.version)
  .option('--leveldb <path>', 'Path to leveldb (default: ./epoch.db')
  .option('-d, --debug [options]')
  .option('-v, --verbose [options]', '')
  .option('--color [options]', 'Color the output')
  .parse(process.argv);

var imp = require(path.join(__dirname, 'smf-import'));
var args = {
  db: program.leveldb,
  debug: program.debug,
  verbose: program.verbose,
  color: program.color
};

imp(args, function (err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Import complete.');
  }
});
