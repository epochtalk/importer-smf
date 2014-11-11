var EpochCollection = module.exports = function EpochCollection() {
  this.collection = {};
};

var helper = {
  process: function(value, validate) {
    return validate ? (value ? value : undefined) : value;
  }
};
var defaultOptions = {
  validate: false
};

EpochCollection.prototype.map = function(oldObject, map, options) {
  for (oldKey in map) {
    var newKey = map[oldKey];
    this.collection[newKey] = helper.process(oldObject[oldKey], options ? options.validate : defaultOptions.validate);
  }
};
EpochCollection.prototype.mapTime = function(oldObject, map, options) {
  for (oldKey in map) {
    var newKey = map[oldKey];
    this.collection[newKey] = helper.process(oldObject[oldKey]*1000, options ? options.validate : defaultOptions.validate);
  }
};
EpochCollection.prototype.mapDate = function(oldObject, map, options) {
  for (oldKey in map) {
    var newKey = map[oldKey];
    this.collection[newKey] = helper.process(new Date(oldObject).getTime(), options ? options.validate : defaultOptions.validate);
  }
};
EpochCollection.prototype.subMap = function(oldObject, map, options) {
  if (!this.collection[options.key]) {
    this.collection[options.key] = {};
  }
  var self = this;
  map.forEach(function (key) {
    //console.log(this.collection);
    self.collection[options.key][key] = helper.process(oldObject[key], options ? options.validate : defaultOptions.validate);
  });
};
EpochCollection.prototype.add = function(key, value, options) {
  this.collection[key] = helper.process(value, options ? options.validate : defaultOptions.validate);
};
