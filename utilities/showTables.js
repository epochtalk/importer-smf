var mysqlQuerier = require('../mysqlQuerier/mysqlQuerier');
var config = require('../config.json');
var mQ = mysqlQuerier(config);

mQ.getTables(null, function (err, tables) {
  if (err) throw err;
  console.log(tables);
  mQ.end();
});
