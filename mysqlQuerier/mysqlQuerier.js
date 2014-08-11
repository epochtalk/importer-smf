var mysql = require('mysql');

var MysqlQuerier = module.exports = function MysqlQuerier(config) {
  if (!(this instanceof MysqlQuerier)) {
    return new MysqlQuerier(config);
  }
  this.pool = mysql.createPool(config);
}

MysqlQuerier.prototype.getTables = function (err, callback) {
  if (err) {
    return callback(err);
  }

  var tables = [];

  this.pool.query('SHOW tables', function (err, rows) {
    rows.forEach(function (row) {
      tables.push(row[Object.keys(row)[0]]);
    });
    return callback(null, tables);
  });
}

MysqlQuerier.prototype.getColumns = function (err, table, callback) {
  if (err) {
    return callback(err);
  }

  this.pool.query('SHOW columns FROM ' + mysql.escapeId(table), function (err, rows) {
    if (callback && typeof(callback) === "function") {
      return callback(null, rows);
    }
  });
}

MysqlQuerier.prototype.getRowsWhere = function (err, table, obj, callback) {
  if (err) {
    return callback(err);
  }

  this.pool.query('SELECT * FROM ' + mysql.escapeId(table) + ' WHERE ' + mysql.escape(obj), function (err, rows) {
    if (callback && typeof(callback) === "function") {
      return callback(null, rows);
    }
  });
}

MysqlQuerier.prototype.createRowStream = function (err, table) {
  return this.pool.query('SELECT * FROM ' + mysql.escapeId(table)).stream();
}

MysqlQuerier.prototype.createRowStreamWhere = function (err, table, obj) {
  return this.pool.query('SELECT * FROM ' + mysql.escapeId(table) + ' WHERE ' + mysql.escape(obj)).stream();
}

MysqlQuerier.prototype.end = function (callback) {
  if (callback && typeof(callback) === "function") {
    this.pool.end(callback());
  }
  else {
    this.pool.end();
  }
}
