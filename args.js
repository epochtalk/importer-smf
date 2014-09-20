var path = require('path');
var pJSON = require(path.join(__dirname, 'package.json'));
var program = require('commander');
program
  .version(pJSON.version)
  .option('--leveldb <path>', 'Path to leveldb (default: ./epoch.db')
  .option('-d, --debug', 'Debug mode')
  .option('-q, --quiet', 'Suppress output')
  .option('--log <file>', 'Log errors to file')
  .parse(process.argv);

module.exports = {
  db: program.leveldb || path.join(process.env.PWD, 'epoch.db'),
  debug: program.debug,
  log: program.log,
  quiet: program.quiet
};

