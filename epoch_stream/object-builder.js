var newObject = {};

var objectBuilder = {
  toObject: function() {
    return newObject;
  },
  map: function(oldObject, map) {
    for (oldKey in map) {
      var newKey = map[oldKey];
      newObject[newKey] = oldObject[oldKey] ? oldObject[oldKey] : undefined;
    }
  },
  mapTime: function(oldObject, map) {
    for (oldKey in map) {
      var newKey = map[oldKey];
      newObject[newKey] = objectBuilder.checkValid(oldObject[oldKey]*1000);
    }
  },
  smfMap: function(oldObject, map) {
    var smfObject = {};
    map.forEach(function (key) {
      smfObject[key] = objectBuilder.checkValid(oldObject[key]);
    });
    newObject.smf = smfObject;
  },
  insert: function(key, value) {
    newObject[key] = objectBuilder.checkValid(value);
  },
  checkValid: function(value) {
    return value ? value : undefined;
  }
}

module.exports = objectBuilder;
