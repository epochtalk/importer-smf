mysql-querier
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
mysql-querier instance.

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
var mysql-querier = require('./mysql-querier');
var mQ = mysql-querier(config);
~~~~


The config is used by node-mysql to connect to a mysql database.
You can define this in the config.json file
like the included example [config.json](./config.json)


Closing
-------

You should always close the connection using:
~~~~
...
mQ.end();
~~~~


Get tables
--------------

~~~~
var config = require('./config.json');
var mysql-querier = require('./mysql-querier');
var mQ = mysql-querier(config);

mQ.getTables(err, callback(err, tables));
~~~~

Get columns
--------------

~~~~
var config = require('./config.json');
var mysql-querier = require('./mysql-querier');
var mQ = mysql-querier(config);

// table is a String, the name of the table
// the input is escaped
mQ.getColumns(err, table, callback(err, tables));
~~~~

Streaming rows
--------------

Basic operation
~~~~
mQ.createRowStream(table[, options]);
~~~

###Arguments

####table

A String, indicating which table to query

####options

`options.columns`

Either a String or an array of strings which
indicate the columns to be queried.

`options.where`

An object of `key: value` pairs.  Parsed by mysql as
`WHERE key = value, key = value, ...` for each entry
in the `where` object.

`options.orderBy`

Either a String or an array of string which indicate
the columns by which to order by and whether they are
in ascending (`'column ASC'`) or descending (`'column DESC'`)
order.

###Examples

~~~~
var options = {};
options.columns = 'test_column';
// OR
options.columns = ['test_column', 'other_test_column', ...];
options.where = {
  field: value,
  other_field: other_value,
  ...
};
options.orderBy = 'test_column';
options.orderBy = 'test_column ASC';
options.orderBy = 'test_column DESC';
// OR
options.orderBy = ['test_column', 'other_test_column ASC', ...];

var rowStream = mQ.createRowStream(table, options);
~~~~
