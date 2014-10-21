var path = require('path');
var fs = require('fs');
var args = require(path.join(__dirname, 'args'));
var log = args.log;
var logfile = module.exports = fs.createWriteStream(log);
