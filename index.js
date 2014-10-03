#!/usr/bin/env node
var path = require('path');
var args = require(path.join(__dirname, 'args'));
var imp = require(path.join(__dirname, 'smf-import'));

imp(args, function (err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Import complete.');
  }
});

process.on('SIGINT', function() {
  process.stdout.moveCursor(0,5);
  process.exit();
});
