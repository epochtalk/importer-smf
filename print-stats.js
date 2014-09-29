var rw = require('rainbow-word');
var rainbow = rw.pattern({
  style: 'bold',
  save: false
});

module.exports = function(count) {
  var printString = [];
  Object.keys(count).forEach(function(field) {
    printString.push(field + ': ' + count[field] + ' ');
  });
  printString.push('\r');
  process.stdout.write(rainbow.convert(printString));
};

