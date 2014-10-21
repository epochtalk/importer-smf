var path = require('path');
var StatLogger = require(path.join(__dirname, 'stat-logger'));
var statFields = ['categories', 'users', 'boards', 'threads', 'posts', 'errors'];
var statLogger = new StatLogger({fields: statFields});
module.exports = statLogger;
