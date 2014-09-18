#!/usr/bin/env node
var path = require('path');
var pJSON = require(path.join(__dirname, 'package.json'));
var program = require('commander');

program
  .version(pJSON.version)
  .option('--leveldb <path>', 'Path to leveldb (default: ./epoch.db')
  .option('-v, --verbose [options]', '')
  .option('-q, --quiet', 'Suppress output')
  .option('--color [options]', 'Color the output')
  .option('--users', 'Only import users')
  .option('--forum', 'Only import boards, threads, and posts')
  .option('--log <file>', 'Log errors to file')
  .parse(process.argv);

var imp = require(path.join(__dirname, 'smf-import'));
var args = {
  db: program.leveldb || path.join(process.env.PWD, 'epoch.db'),
  verbose: program.verbose,
  users: program.users,
  forum: program.forum,
  log: program.log,
  quiet: program.quiet,
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
