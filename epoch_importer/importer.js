var through2 = require('through2');

var Importer = module.exports = function(options, importType, handler, callback) {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  var options = args.shift();
  this.importType = args.shift();
  this.callback = args.pop();
  this.handler = args.pop();

  var leveldbPath = args.db;
  this.core = require('epochcore')(leveldbPath);
  this.quiet = options.quiet;
  this.importCount = 0;
  var self = this;
  return through2.obj(function(epochObject, enc, trCb) {
    self.core[self.importType].import(epochObject)
    .then(function(newObject) {
      if (!self.quiet) {
        self.importCount++;
        process.stdout.write(self.importCount+'\r');
        //printStats(uIC, bIC, tIC, pIC, eIC);
      }
      trCb();
    })
    .catch(function(err) {
      if (!self.quiet) {
        //eIC++;
        //printStats(uIC, bIC, tIC, pIC, eIC);
      }
      trCb();
    });
  }, self.callback);
};
