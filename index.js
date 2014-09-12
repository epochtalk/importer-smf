var path = require('path');
var pJSON = require(path.join(__dirname, 'package.json'));
var program = require('commander');

program
  .version(pJSON.version)
  .option('--leveldb <path>', 'Path to leveldb (default: ./epoch.db')
  .option('-d, --debug [options]')
  .option('-v, --verbose [options]', '')
  .option('--color [options]', 'Color the output')
  .option('--users', 'Only import users')
  .option('--forum', 'Only import boards, threads, and posts')
  .option('--log <file>', 'Log errors to file')
  .parse(process.argv);

var imp = require(path.join(__dirname, 'smf-import'));
var args = {
  db: program.leveldb,
  debug: program.debug,
  verbose: program.verbose,
  users: program.users,
  forum: program.forum,
  log: program.log,
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
