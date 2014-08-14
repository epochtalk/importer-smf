var mysql = require('mysql');
var pool = null;

module.exports = function(config) {
  pool = mysql.createPool(config);
  return MysqlQuerier;
}

var MysqlQuerier = {
  getTables: function (err, callback) {
               var tables = [];

               pool.query('SHOW tables', function (err, rows) {
                 rows.forEach(function (row) {
                   tables.push(row[Object.keys(row)[0]]);
                 });
                 return callback(err, tables);
               });
             },
  getColumns: function (err, table, callback) {
                pool.query('SHOW columns FROM ??', table, function (err, rows) {
                  return callback(err, rows);
                });
              },
  getRowsWhere: function (err, table, obj, callback) {
                  pool.query('SELECT * FROM ?? WHERE ?', [table, obj], function (err, rows) {
                    return callback(err, rows);
                  });
                },
  createRowStream: function (err, table) {
                     return pool.query('SELECT * FROM ??', table).stream();
                   },
  createRowStreamWhere: function (err, table, obj) {
                          return pool.query('SELECT * FROM ?? WHERE ?', [table,obj]).stream();
                        },
  end: function (callback) {
         if (callback && prototypeof(callback) === "function") {
           pool.end(callback());
         }
         else {
           pool.end();
         }
       }
}
