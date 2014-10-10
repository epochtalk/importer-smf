#!/usr/bin/env node
var path = require('path');
var chalk = require('chalk');
var args = require(path.join(__dirname, 'args'));
var imp = require(path.join(__dirname, 'smf-import'));
var mQ = require(path.join(__dirname, 'mq'));

imp(args, function (err) {
  if (err) {
    process.stdout.write(chalk.red('\n'+err+'\n'));
  }
  else {
    mQ.end(function() {
      process.stdout.write(chalk.green('\nImport Complete.\n'));
    });
  }
});

process.on('SIGINT', function() {
  process.stdout.moveCursor(0,5);
  process.exit();
});
