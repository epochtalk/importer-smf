var newObject = {};
var defaultOptions = {
  validate: false
};

var helper = {
  process: function(value, validate) {
    return validate ? (value ? value : undefined) : value;
  }
};

var objectBuilder = {
  toObject: function() {
    return newObject;
  },
  map: function(oldObject, map, options) {
    for (oldKey in map) {
      var newKey = map[oldKey];
      newObject[newKey] = helper.process(oldObject[oldKey], options ? options.validate : defaultOptions.validate);
    }
  },
  mapTime: function(oldObject, map, options) {
    for (oldKey in map) {
      var newKey = map[oldKey];
      newObject[newKey] = helper.process(oldObject[oldKey]*1000, options ? options.validate : defaultOptions.validate);
    }
  },
  subMap: function(oldObject, map, options) {
    if (!newObject[options.key]) {
      newObject[options.key] = {};
    }
    map.forEach(function (key) {
      newObject[options.key][key] = helper.process(oldObject[key], options ? options.validate : defaultOptions.validate);
    });
  },
  insert: function(key, value, options) {
    newObject[key] = helper.process(value, options ? options.validate : defaultOptions.validate);
  }
};

module.exports = objectBuilder;
