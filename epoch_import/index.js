var path = require('path');
var epochImport = {};

epochImport.categories = require(path.join(__dirname, 'import-categories'));
epochImport.users = require(path.join(__dirname, 'import-users'));
epochImport.boards = require(path.join(__dirname, 'import-boards'));
epochImport.threads = require(path.join(__dirname, 'import-threads'));
epochImport.posts = require(path.join(__dirname, 'import-posts'));

module.exports = epochImport;
