var path = require('path');
var MysqlQuerier = require(path.join(__dirname, 'mysql-querier'));
var config = require(path.join(__dirname, 'config.json'));
var async = require('async');
var through2 = require('through2');
var mQ = null;

var tests = [
  function(callback) {
    mQ = new MysqlQuerier(config, callback);
  },
  function(callback) {
    console.log('asodijsadicjo');
    mQ.getTables(callback);
  },
  function(callback) {
    mQ.getColumns('test_table', callback);
  },
  function(callback) {
    var rowsWhere = mQ.getRowsWhere('test_table', { percent: 10 }, callback);
  },
  function(callback) {
    var rowStream = mQ.createRowStream('test_table');
    var rowStreamT2 = through2.obj(function(row, enc, cb) {
      console.log('testRowStream: ');
      console.log(row.percent);
      cb();
    }, callback);
    rowStream.pipe(rowStreamT2);
  },
  function(callback) {
    var rowStreamWhere = mQ.createRowStreamWhere('test_table', { percent: 10 });
    var rowStreamWhereT2 = through2.obj(function(row, enc, cb) {
      console.log('testRowStreamWhere: ' + row.percent);
      cb();
    }, callback);
    rowStreamWhere.pipe(rowStreamWhereT2);
  },
  function(callback) {
    mQ.end(callback);
  }
];

async.series(tests, function(err, results) {
  if (err) {
    console.log(err);
  }
  else {
    console.log(results);
  }
});
