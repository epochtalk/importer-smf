var path = require('path');
var mysql = require('mysql');
var Querier = require(path.join(__dirname, 'querier'));
var mysqlQuerier = {};
var pool;

module.exports = function(config) {
  pool = mysql.createPool(config);
  mysqlQuerier.getQuerier = function(callback) {
    return new Querier(pool, callback);
  };

  mysqlQuerier.end = function(callback) {
    if (callback && typeof(callback) === "function") {
      pool.end(callback);
    }
    else {
      pool.end();
    }
  };
  return mysqlQuerier;
};

