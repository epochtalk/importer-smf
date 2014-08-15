var path = require('path');
var mysqlQuerier = require(path.join(__dirname, 'mysql-querier'));
var config = require(path.join(__dirname, 'config.json'));
var mQ = mysqlQuerier(config);
var async = require('async');
var through2 = require('through2');

var tests = {
  getTables: function(callback) {
           mQ.getTables(function(err, tables) {
             if (err) {
               console.log(err);
             }

             console.log('testGetTables:\n'+tables);
             callback();
           });
         },
  getColumns: function(callback) {
            mQ.getColumns('test_table', function(err, columns) {
              if (err) {
                console.log(err);
              }

              console.log('testGetColumns:');
              console.log(columns);
              callback();
            });
          },
  getRowsWhere: function(callback) {
                  var rowsWhere = mQ.getRowsWhere('test_table', { percent: 10 },
                      function(err, rows) {
                        if (err) {
                          console.log(err);
                        }

                        console.log('testGetRowsWhere:');
                        console.log(rows);
                        callback();
                      });
                },
  rowStream: function(callback) {
           var rowStream = mQ.createRowStream('test_table');
           var rowStreamT2 = through2.obj(function(row, enc, cb) {
             console.log('testRowStream: ');
             console.log(row.percent);
             cb();
           },
           function() {
             callback();
           });
           rowStream.pipe(rowStreamT2);
         },

  rowStreamWhere: function(callback) {
            var rowStreamWhere = mQ.createRowStreamWhere('test_table', { percent: 10 });
            var rowStreamWhereT2 = through2.obj(function(row, enc, cb) {
              console.log('testRowStreamWhere: ' + row.percent);
              cb();
            },
            function() {
              callback();
            });
            rowStreamWhere.pipe(rowStreamWhereT2);
          }
}

async.parallel(tests, function(err, results) {
  mQ.end(function() {
    console.log('done');
  });
});
