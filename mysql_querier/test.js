var path = require('path');
var MysqlQuerier = require(path.join(__dirname, 'mysql-querier'));
var config = require(path.join(__dirname, 'config.json'));
var async = require('async');
var through2 = require('through2');
var mQ = new MysqlQuerier(config);

var tests = [
  function(callback) {
    var querier = mQ.getQuerier(function(err) {
      if (err) {
        callback(err);
      }
      querier.getTables(function(err, results) {
        querier.release();
        return callback(err, results);
      });
    });
  },
  function(callback) {
    var querier = mQ.getQuerier(function(err) {
      if (err) {
        callback(err);
      }
      querier.getColumns('test_table', function(err, results) {
        querier.release();
        return callback(err, results);
      });
    });
  },
  function(callback) {
    var querier = mQ.getQuerier(function(err) {
      if (err) {
        callback(err);
      }
      querier.getRowsWhere('test_table', {percent: 10}, function(err, results) {
        querier.release();
        return callback(err, results);
      });
    });
  },
  function(callback) {
    var querier = mQ.getQuerier(function(err) {
      if (err) {
        callback(err);
      }
      var results = [];
      var rowStream = querier.createRowStream('test_table');
      rowStream.pipe(through2.obj(function(row, enc, cb) {
        results.push(row.percent);
        cb();
      }, function() {
        querier.release();
        return callback(err, results);
      }));
    });
  },
  function(callback) {
    var querier = mQ.getQuerier(function(err) {
      if (err) {
        callback(err);
      }
      var results = [];
      var rowStream = querier.createRowStream('test_table', {orderBy: 'percent'});
      rowStream.pipe(through2.obj(function(row, enc, cb) {
        results.push(row.percent);
        cb();
      }, function() {
        querier.release();
        return callback(err, results);
      }));
    });
  },
  function(callback) {
    var querier = mQ.getQuerier(function(err) {
      if (err) {
        callback(err);
      }
      var results = [];
      var rowStream = querier.createRowStream('test_table', {where: {'percent': 10}});
      rowStream.pipe(through2.obj(function(row, enc, cb) {
        results.push(row.percent);
        cb();
      }, function() {
        querier.release();
        return callback(err, results);
      }));
    });
  }
];

async.series(tests, function(err, results) {
  if (err) {
    console.log(err);
  }
  else {
    console.log(results);
  }
  mQ.end();
});
