var ObjectBuilder = module.exports = function ObjectBuilder() {
  this.newObject = {};
}

var helper = {
  process: function(value, validate) {
    return validate ? (value ? value : undefined) : value;
  }
};
var defaultOptions = {
  validate: false
};

ObjectBuilder.prototype.map = function(oldObject, map, options) {
  for (oldKey in map) {
    var newKey = map[oldKey];
    this.newObject[newKey] = helper.process(oldObject[oldKey], options ? options.validate : defaultOptions.validate);
  }
}
ObjectBuilder.prototype.mapTime = function(oldObject, map, options) {
  for (oldKey in map) {
    var newKey = map[oldKey];
    this.newObject[newKey] = helper.process(oldObject[oldKey]*1000, options ? options.validate : defaultOptions.validate);
  }
}
ObjectBuilder.prototype.subMap = function(oldObject, map, options) {
  if (!this.newObject[options.key]) {
    this.newObject[options.key] = {};
  }
  var self = this;
  map.forEach(function (key) {
    //console.log(this.newObject);
    self.newObject[options.key][key] = helper.process(oldObject[key], options ? options.validate : defaultOptions.validate);
  });
}
ObjectBuilder.prototype.insert = function(key, value, options) {
  this.newObject[key] = helper.process(value, options ? options.validate : defaultOptions.validate);
}
