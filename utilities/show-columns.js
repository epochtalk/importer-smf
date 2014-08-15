var path = require('path');
var mysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier', 'mysql-querier'));
var mQConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
var mQ = mysqlQuerier(mQConfig);

mQ.getColumns(process.argv[2], function (err, columns) {
  if (err) {
    console.log(err);
  }
  columns.forEach(function (column) {
    console.log(column.Field);
  });
  mQ.end();
});
