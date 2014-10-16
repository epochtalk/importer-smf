var path = require('path');
var args = require(path.join(__dirname, 'args'));
var db = require('levelup')(args.db);
var treesdb = require('treedb')(db);
treesdb.addSecondaryIndex('thread', 'board', 'updated_at');
treesdb.addSecondaryIndex('post', 'thread', 'created_at');
module.exports = treesdb;
