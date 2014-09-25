var path = require('path');
var pJSON = require(path.join(__dirname, 'package.json'));
var program = require('commander');
program
  .version(pJSON.version)
  .option('--leveldb <path>', 'Path to leveldb (default: ./epoch.db')
  .option('-d, --debug', 'Debug mode')
  .option('-q, --quiet', 'Suppress output')
  .option('--log <file>', 'Log errors to file')
  .option('--mysqlConfig <file>', 'Config JSON file for mysql connection (default: $HOME/.epoch/admin/log.txt)')
  .parse(process.argv);

module.exports = {
  db: program.leveldb || path.join(process.env.PWD, 'epoch.db'),
  debug: program.debug,
  log: program.log,
  quiet: program.quiet,
  mysqlConfig: program.mysqlConfig || require(path.join(process.env.HOME,'.epoch','admin', 'mysql-config'))
};
