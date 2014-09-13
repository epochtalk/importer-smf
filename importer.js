var through2 = require('through2');

var Importer = module.exports = function(args, callback) {
  var leveldbPath = args.db;
  this.core = require('epochcore')(leveldbPath);
  this.quiet = args.quiet;
  this.importCount = 0;
  this.importType = args.importType;
  this.callback = callback;
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

/*
Importer.prototype.import = function(){
};
*/
