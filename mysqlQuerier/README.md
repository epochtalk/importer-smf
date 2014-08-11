lolipop
=======

A utility to make calls to mysql through nodejs (somewhat) more modular.

Configuration
-------------

Configuration can be stored in a json file.

Options are described in node-mysql [connection
options](https://github.com/felixge/node-mysql#connection-options).

Implementation is with pools, so you can also use node-mysql [pooling
options](https://github.com/felixge/node-mysql#pool-options).

To make full use of the connectionLimit option, have your queries share a
lolipop instance.

<h3>config.json</h3>
~~~~
{
  "host" : "localhost",
  "user" :  "lolipop",
  "password" :  "",
  "database" : "lolipoptest",
  "connectionLimit": 5
}
~~~~

Instantiation
-------------

~~~~
var config = require('./config.json');
var lolipop = require('./lolipop');
var lp = lolipop(config);
~~~~


The config is used by node-mysql to connect to a mysql database.
You can define this in the config.json file
like the included example [config.json](./config.json)


Closing
-------

You should always close the connection using:
~~~~
...
lp.end();
~~~~


Get tables
--------------

~~~~
var config = require('./config.json');
var lolipop = require('./lolipop');
var lp = lolipop(config);

lp.getTables(err, callback(err, tables));
~~~~

Get columns
--------------

~~~~
var config = require('./config.json');
var lolipop = require('./lolipop');
var lp = lolipop(config);

// table is a String, the name of the table
// the input is escaped
lp.getColumns(err, table, callback(err, tables));
~~~~

Streaming rows
--------------

~~~~
...

// table is a String, the name of the table
// the input is escaped
var rowStream = lp.createRowStream(err, table);
rowStream.on('error', function {
  // do something with error
})
.on('result', function(row) {
  // do something with result
});
~~~~

Streaming rows with WHERE
-------------------------

~~~~
...

var obj = { field : value };

var rowStreamWhere = lolipop.createRowStreamWhere(err, table, obj);
// SELECT * FROM 'table' WHERE 'field' = value;
~~~~
