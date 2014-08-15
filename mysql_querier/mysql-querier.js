var mysql = require('mysql');
var pool = null;

module.exports = function(config) {
  pool = mysql.createPool(config);
  return MysqlQuerier;
}

var MysqlQuerier = {
  getTables: function (callback) {
               var tables = [];

               pool.query('SHOW tables', function (err, rows) {
                 rows.forEach(function (row) {
                   tables.push(row[Object.keys(row)[0]]);
                 });
                 return callback(err, tables);
               });
             },
  getColumns: function (table, callback) {
                pool.query('SHOW columns FROM ??', table, function (err, rows) {
                  return callback(err, rows);
                });
              },
  getRowsWhere: function (table, obj, callback) {
                  pool.query('SELECT * FROM ?? WHERE ?', [table, obj], function (err, rows) {
                    return callback(err, rows);
                  });
                },
  createRowStream: function (table) {
                     return pool.query('SELECT * FROM ??', table).stream();
                   },
  createRowStreamWhere: function (table, obj) {
                          return pool.query('SELECT * FROM ?? WHERE ?', [table,obj]).stream();
                        },
  end: function (callback) {
         if (callback && typeof(callback) === "function") {
           pool.end(callback());
         }
         else {
           pool.end();
         }
       }
}
