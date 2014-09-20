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
