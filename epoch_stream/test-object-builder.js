var path = require('path');
var objectBuilder = require(path.join(__dirname, 'object-builder'));

var oldObject = {
  someTime: 10,
  otherTime: 1000,
  invalidTime: null,
  someProperty: 'Hello World',
  otherProperty: 'All your base are belong to us',
  invalidProperty: '',
  CAPS_LOCK: 'CRUISE CONTROL',
  UNDER_SCORE: 'OVER-SCORE'
};

var objectMap = {
  someProperty: 'title',
  otherProperty: 'body',
  invalidProperty: 'invalid_property'
};
var timeMap = {
  someTime: 'created_at',
  otherTime: 'updated_at',
  invalidTime: 'invalid_time'
};
var smfMap = [
  'CAPS_LOCK',
  'UNDER_SCORE'
];

var key = 'this_key';
var value = 'this_value';
var otherKey = 'invalid_key';
var invalidValue = null;

objectBuilder.map(oldObject, objectMap);
objectBuilder.mapTime(oldObject, timeMap);
objectBuilder.smfMap(oldObject, smfMap);
objectBuilder.insert(key, value);
objectBuilder.insert(otherKey, invalidValue);

console.log(objectBuilder.toObject());
