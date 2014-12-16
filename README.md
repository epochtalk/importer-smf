epoch-smf-import
================

A tool to import data from an SMF database to Epochtalk.

##Installation

~~~~
npm install
~~~~


##Running

~~~~
epoch-smf-import [options]
~~~~

Or use the npm script:

~~~~
npm run import
~~~~


##Configuration

###mysqlConfig

See [node-mysql
options](https://github.com/felixge/node-mysql#connection-options) for full set
of options.
An example configuration:

`$HOME/.epoch/admin/mysql-config.json`
~~~~
{
  "host": "127.0.0.1",
  "database": "database_name",
  "user": "username",
  "password": "password123"
}
~~~~

##Arguments

The help menu provides an overview of the arguments.

~~~~
epoch-smf-import --help
~~~~
