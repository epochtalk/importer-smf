var mysql = require('mysql');

var MysqlQuerier = module.exports = function(config, callback) {
  this.pool = mysql.createPool(config);
  this.pool.getConnection(function(err, connection) {
    if (!err) {
      connection.release();
    }
    else {
      callback(err);
    }
  });
}

MysqlQuerier.prototype.getTables = function(callback) {
  var tables = [];

  this.pool.query('SHOW tables', function(err, rows) {
    if (!err) {
      rows.forEach(function(row) {
        tables.push(row[Object.keys(row)[0]]);
      });
    }
    return callback(err, tables);
  });
}
MysqlQuerier.prototype.getColumns = function(table, callback) {
  this.pool.query('SHOW columns FROM ??', table, function(err, rows) {
    return callback(err, rows);
  });
}
MysqlQuerier.prototype.getRowsWhere = function(table, obj, callback) {
  this.pool.query('SELECT * FROM ?? WHERE ?', [table, obj], function(err, rows) {
    return callback(err, rows);
  });
}
MysqlQuerier.prototype.getRowsWhereColumn = function(table, obj, columns, callback) {
  this.pool.query('SELECT ?? FROM ?? WHERE ?', [columns, table, obj], function(err, rows) {
    return callback(err, rows);
  });
}
MysqlQuerier.prototype.createRowStream = function(table, columns) {
  if (Array.isArray(columns)) {
    return this.pool.query('SELECT ?? FROM ??', [columns, table]).stream();
  }
  else {
    return this.pool.query('SELECT * FROM ??', table).stream();
  }
}
MysqlQuerier.prototype.createRowStreamWhere = function(table, obj, columns) {
  if (Array.isArray(columns)) {
    return this.pool.query('SELECT ?? FROM ?? WHERE ?', [columns, table, obj]).stream();
  }
  else {
    return this.pool.query('SELECT * FROM ?? WHERE ?', [table, obj]).stream();
  }
}
MysqlQuerier.prototype.end = function(callback) {
  if (callback && typeof(callback) === "function") {
    this.pool.end(callback());
  }
  else {
    this.pool.end();
  }
}
