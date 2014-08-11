var through2 = require('through2');
var epochPostStream = require('../epochPostStream');
var lolipop = require('../../lolipop/lolipop');
var lpConfig = require('../config.json');
var lp = lolipop(lpConfig);

var eps = epochPostStream(lp);
var postStream = eps.createPostStream(null, 5, 0);

var tr = through2.obj(function (data, enc, cb) {
  console.log('test: ');
  console.log(data);
  return cb();
},
function () {
  lp.end();
});

postStream.pipe(tr);
