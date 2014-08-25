var path = require('path');
var smfImporter = require(path.join(__dirname, '..', 'smf-import'));

smfImporter({debug: true, db: path.join(process.env.PWD, 'epoch.db')}, function() {
  console.log('done');
});
