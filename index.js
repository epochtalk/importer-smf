#!/usr/bin/env node
var path = require('path');
var chalk = require('chalk');
var args = require(path.join(__dirname, 'args'));
var imp = require(path.join(__dirname, 'smf-import'));
var mQ = require(path.join(__dirname, 'mq'));
var statLogger = require(path.join(__dirname, 'stats'));

imp(args, function (err, results) {
  if (err) {
    process.stdout.write(chalk.red('\n'+err+'\n'));
  }
  else {
    mQ.end(function() {
      statLogger.end();
      console.log(chalk.green(results.toString()));
      console.log(chalk.green('Import Complete.'));
    });
  }
});

process.on('SIGINT', function() {
  statLogger.end();
  process.exit();
});
