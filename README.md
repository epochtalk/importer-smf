btcdb
=====

Preliminary implementation of mysql database querier for importing to leveldb.


epochMap Methods
----------------

<h3>remapObject (oldObject, map);</h3>

Creates an object by mapping values (by key) from an old object to new keys.

~~~~
var oldObject = {
  oldKey1 : 'oldValue1',
  oldKey2 : 'oldValue2'
}

var map = {
  oldKey1 : 'newKey1',
  oldKey2 : 'newKey2'
}

var newObject = epochMap.remapObject(oldObject, map);
// {
//   newKey1 : 'oldValue1',
//   newKey2 : 'oldValue2'
// }
~~~~

(Note:  Strangely, this is a fairly useful method that simplifies the API)


Show tables
-----------

~~~~
node utilities/showTables
~~~~
OR
~~~~
node utilities/showTables dbname
~~~~

Show columns
------------

~~~~
node utilities/showColumns tablename
~~~~

Show rows
---------

~~~~
node utilities/showRows tablename
~~~~


Stream rows to level
--------------------

This cannot be done generically.  Table-streaming implementation examples are
available in files:  [epochPostStream](./epochPostStream.js),
[epochThreadStream](./epochThreadStream.js), and
[epochBoardStream](./epochBoardStream.js). 

These implementations are combined in [epochImporter](./epochImporter.js), where
a waterfall/hierarchical approach is taken to stream Boards, Threads from each
board, and Posts from each thread by setting appropriate fields by newId via
callback function of the importer method used.

To test these implementations, drivers have been created:
[testEpochBoardStream](./testDrivers/testEpochBoardStream.js),
[testEpochThreadStream](./testDrivers/testEpochThreadStream.js),
and [testEpochPostStream](./testDrivers/testEpochPostStream.js).
