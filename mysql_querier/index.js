var path = require('path');
var mysql = require('mysql');
var Querier = require(path.join(__dirname, 'querier'));

var MysqlQuerier = module.exports = function(config) {
  this.pool = mysql.createPool(config);
};

MysqlQuerier.prototype.getQuerier = function(callback) {
  return new Querier(this.pool, callback);
};

MysqlQuerier.prototype.end = function(callback) {
  this.pool.end(callback);
};
