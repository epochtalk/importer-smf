var through2 = require('through2');
var epochThreadStream = require('../epochThreadStream');
var lolipop = require('../../lolipop/lolipop');
var lpConfig = require('../config.json');
var lp = lolipop(lpConfig);

var ets = epochThreadStream(lp);
var threadStream = ets.createThreadStream(null, 86, 0);

var tr = through2.obj(function (data, enc, cb) {
  console.log('test: ');
  console.log(data);
  return cb();
},
function () {
  lp.end();
});

threadStream.pipe(tr);
