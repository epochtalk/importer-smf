var path = require('path');
var smfImporter = require(path.join(__dirname, '..', 'smf-importer'));
var debug = true;

smfImporter(debug, function() {
  console.log('done');
});
