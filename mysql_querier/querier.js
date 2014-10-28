var Querier = module.exports = function(pool, callback) {
  var self = this;
  pool.getConnection(function(err, connection) {
    self.connection = connection;
    callback(err);
  });
};

Querier.prototype.getTables = function(callback) {
  var tables = [];

  this.connection.query('SHOW tables', function(err, rows) {
    if (!err) {
      rows.forEach(function(row) {
        tables.push(row[Object.keys(row)[0]]);
      });
    }
    return callback(err, tables);
  });
};
Querier.prototype.getColumns = function(table, callback) {
  this.connection.query('SHOW columns FROM ??', table, function(err, rows) {
    return callback(err, rows);
  });
};
Querier.prototype.getRowsWhere = function(table, obj, callback) {
  this.connection.query('SELECT * FROM ?? WHERE ?', [table, obj], function(err, rows) {
    return callback(err, rows);
  });
};
Querier.prototype.getRowsWhereColumn = function(table, obj, columns, callback) {
  this.connection.query('SELECT ?? FROM ?? WHERE ?', [columns, table, obj], function(err, rows) {
    return callback(err, rows);
  });
};
Querier.prototype.createRowStream = function(table, options) {
  if (!options) {
    return this.connection.query('SELECT * FROM ??', table).stream();
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
      if (options.where.operation) {
        var op = options.where.operation;
        if (op === '<' || op === '>' || op === '=' || op === '>=' || op === '<=' || op === '<>') {
          query += 'WHERE ?? ';
          escapeValues.push(options.where.field);
          query += op;
          query += ' ? ';
          escapeValues.push(options.where.value);
        }
      }
      else {
        query += 'WHERE ? ';
        escapeValues.push(options.where);
      }
    }

    // Orders by columns in an array
    // ["column ASC", "column DESC", ...]
    if (options.orderBy) {
      query += 'ORDER BY ?? ';
      escapeValues.push(options.orderBy);
    }
    return this.connection.query(query, escapeValues).stream();
  }
};
Querier.prototype.release = function(callback) {
  if (callback && typeof(callback) === "function") {
    this.connection.release(callback());
  }
  else {
    this.connection.release();
  }
};
