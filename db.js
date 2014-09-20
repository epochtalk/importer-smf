var path = require('path');
var args = require(path.join(__dirname, 'args'));
var epochcore = require('epochcore')(args.db);
module.exports = epochcore;
