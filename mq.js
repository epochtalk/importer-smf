var path = require('path');
var args = require(path.join(__dirname, 'args'));
var mysqlConfig = args.mysqlConfig;
mysqlConfig.connectionLimit = 6;
var MysqlQuerier = require(path.join(__dirname, 'mysql_querier'));
var mQ = new MysqlQuerier(mysqlConfig);
module.exports = mQ;
