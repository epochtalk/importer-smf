var through2 = require('through2');
var epochBoardStream = require('../epochBoardStream');
var lolipop = require('../../lolipop/lolipop');
var lpConfig = require('../config.json');
var lp = lolipop(lpConfig);

var ebs = epochBoardStream(lp);
var boardStream = ebs.createBoardStream();

var tr = through2.obj(function (data, enc, cb) {
  console.log('test: ');
  console.log(data);
  return cb();
},
function() {
  lp.end();
});

boardStream.pipe(tr);
