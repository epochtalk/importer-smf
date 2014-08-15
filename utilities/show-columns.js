var path = require('path');
var mysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier', 'mysql-querier'));
var config = require(path.join(__dirname, '..', 'config.json'));
mQ = mysqlQuerier(config);

mQ.getColumns(null, process.argv[2], function (err, columns) {
  if (err) {
    console.log(err);
  }
  columns.forEach(function (column) {
    console.log(column.Field);
  });
  mQ.end();
});