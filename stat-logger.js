var labeler = require('labeler');

var StatLogger = module.exports = function(options) {
  this.fields = {};
  var self = this;
  options.fields.forEach(function(fieldName) {
    self.fields[fieldName] = {};
    self.fields[fieldName].count = 0;
    self.fields[fieldName].labeler = labeler.create(fieldName + ': ');
    self.fields[fieldName].labeler.write(self.fields[fieldName].count.toString());
  });
};

StatLogger.prototype.increment = function(fieldName) {
  if(this.fields[fieldName]) {
    this.fields[fieldName].count++;
    this.fields[fieldName].labeler.write(this.fields[fieldName].count.toString());
  }
};
StatLogger.prototype.tag = function(fieldName, tag) {
  if(this.fields[fieldName]) {
    this.fields[fieldName].labeler.tag(this.fields[fieldName].count.toString(), tag);
  }
};

StatLogger.prototype.end = function() {
  labeler.end();
};
