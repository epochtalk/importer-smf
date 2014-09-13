var Importer = module.exports = function(args, callback) {
  var path = require('path');
  var through2 = require('through2');
  var leveldbPath= args.db;
  var core = require('epochcore')(leveldbPath);
  var verbose = args.verbose;
  var userImportCount = 0;
  var logfile = args.log;
  if (logfile) {
    var fs = require('fs');
    var log = fs.createWriteStream(logfile);
  }
  this.importType = args.importType;
  this.importCount = 0;
  var self = this;
  var throughImporter = through2.ctor({objectMode: true}, function(epochObject, enc, trCb) {
    core[self.importType].import(epochObject)
    .then(function(newObject) {
      if (verbose) {
        self.importCount++;
        process.stdout.write(self.importCount+'\r');
        //printStats(uIC, bIC, tIC, pIC, eIC);
      }
      trCb();
    })
    .catch(function(err) {
      if (verbose) {
        //eIC++;
        //printStats(uIC, bIC, tIC, pIC, eIC);
      }
      if (logfile) {
        log.write(this.importType + ' Error:\n');
        log.write(err.toString()+'\n');
      }
      trCb();
    });
  }, callback);
  return new throughImporter();
};
