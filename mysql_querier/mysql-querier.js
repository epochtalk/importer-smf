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
};

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
};
MysqlQuerier.prototype.getColumns = function(table, callback) {
  this.pool.query('SHOW columns FROM ??', table, function(err, rows) {
    return callback(err, rows);
  });
};
MysqlQuerier.prototype.getRowsWhere = function(table, obj, callback) {
  this.pool.query('SELECT * FROM ?? WHERE ?', [table, obj], function(err, rows) {
    return callback(err, rows);
  });
};
MysqlQuerier.prototype.getRowsWhereColumn = function(table, obj, columns, callback) {
  this.pool.query('SELECT ?? FROM ?? WHERE ?', [columns, table, obj], function(err, rows) {
    return callback(err, rows);
  });
};
MysqlQuerier.prototype.createRowStream = function(table, options) {
  if (!options) {
    return this.pool.query('SELECT * FROM ??', table).stream();
  }
  else {
    var escapeValues = [];
    var query = 'SELECT ';

    // Specific columns in an array
    if (options.columns) {
      query += '?? ';
      escapeValues.push(options.columns);
    }
    else {
      query += '* ';
    }

    // The table
    query += 'FROM ?? ';
    escapeValues.push(table);

    // Where key = value for each object entry
    if (options.where) {
      query += 'WHERE ? ';
      escapeValues.push(options.where);
    }

    // Orders by columns in an array
    // ["column ASC", "column DESC", ...]
    if (options.orderBy) {
      query += 'ORDER BY ?? ';
      escapeValues.push(options.orderBy);
    }
    return this.pool.query(query, escapeValues).stream();
  }
};
MysqlQuerier.prototype.end = function(callback) {
  if (callback && typeof(callback) === "function") {
    this.pool.end(callback());
  }
  else {
    this.pool.end();
  }
};
