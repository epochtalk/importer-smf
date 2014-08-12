var path = require('path');
var mysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier', 'mysql-querier'));
var config = require(path.join(__dirname, '..', 'config.json'));
var mQ = mysqlQuerier(config);

mQ.getTables(null, function (err, tables) {
  if (err) throw err;
  console.log(tables);
  mQ.end();
});
