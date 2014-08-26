var path = require('path');
var userImporter = require(path.join(__dirname, '..', 'user-import'));

userImporter({debug: true, db: path.join(process.env.PWD, 'epoch.db')}, function() {
  console.log('done');
});
