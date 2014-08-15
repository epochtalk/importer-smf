var path = require('path');
var mysqlQuerier = require(path.join(__dirname, '..', 'mysql_querier'));
var mQConfig = require(path.join(process.env.HOME,'.epoch_admin', 'mysql-config'));
var mQ = mysqlQuerier(mQConfig);

mQ.getTables(function(err, tables) {
  if (err) throw err;
  console.log(tables);
  mQ.end();
});
