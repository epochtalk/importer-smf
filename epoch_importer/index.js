var path = require('path');
var epochImporter = {};

epochImporter.importUsers = require(path.join(__dirname, 'import-users'));
epochImporter.importBoards = require(path.join(__dirname, 'import-boards'));
epochImporter.importThreads = require(path.join(__dirname, 'import-threads'));
epochImporter.importPosts = require(path.join(__dirname, 'import-posts'));

module.exports = epochImporter;
