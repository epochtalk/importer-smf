var path = require('path');
var db = require(path.join(__dirname, 'db'));
var async = require('async');
var epochImport = require(path.join(__dirname,'epoch_import'));

module.exports = function smfImport(args, topCallback) {
  async.series(epochImport.imports, topCallback);
};
