var mysqlQuerier = require('../mysqlQuerier/mysqlQuerier');
var config = require('../config.json');
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
