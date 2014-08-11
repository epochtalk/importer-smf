exports.remapObject = function (oldObject, map) {
  var obj = {};
  for (oldKey in map) {
    var newKey = map[oldKey];
    obj[newKey] = oldObject[oldKey] ? oldObject[oldKey] : undefined;
  }
  return obj;
}
