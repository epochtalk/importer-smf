#!/usr/bin/env node
var path = require('path');
var pJSON = require(path.join(__dirname, 'package.json'));
var program = require('commander');

program
  .version(pJSON.version)
  .option('--leveldb <path>', 'Path to leveldb (default: ./epoch.db')
  .option('-q, --quiet', 'Suppress output')
  .option('--log <file>', 'Log errors to file')
  .parse(process.argv);

var imp = require(path.join(__dirname, 'smf-import'));
var args = {
  db: program.leveldb || path.join(process.env.PWD, 'epoch.db'),
  log: program.log,
  quiet: program.quiet
};

imp(args, function (err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Import complete.');
  }
});
