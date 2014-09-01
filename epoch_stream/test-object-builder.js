var path = require('path');
var objectBuilder = require(path.join(__dirname, 'object-builder'));

var oldObject = {
  someTime: 10,
  otherTime: 1000,
  zeroTime: 0,
  invalidTime: null,
  stringTime: '100',
  invalidStringTime: 'Not a time',
  someProperty: 'Hello World',
  otherProperty: 'All your base are belong to us',
  invalidProperty: '',
  CAPS_LOCK: 'CRUISE CONTROL',
  UNDER_SCORE: 'OVER-SCORE',
  ZERO_FIELD: 0,
  EMPTY_STRING: '',
  ANOTHER_FIELD: 'flowers',
  NULL_FIELD: null
};

var objectMap = {
  someProperty: 'title',
  otherProperty: 'body'
};
var safeObjectMap = {
  invalidProperty: 'invalid_property'
};
var timeMap = {
  someTime: 'created_at',
  otherTime: 'updated_at',
  zeroTime: 'zero_time'
};
var safeTimeMap = {
  invalidTime: 'invalid_time',
  stringTime: 'string_time',
  invalidStringTime: 'invalid_string_time'
};
var subMap = [
  'CAPS_LOCK',
  'UNDER_SCORE',
  'ZERO_FIELD',
  'EMPTY_STRING',
  'NULL_FIELD'
];
var subMapAgain = [
  'ANOTHER_FIELD'
];
var safeSubMap = [
  'CAPS_LOCK',
  'UNDER_SCORE',
  'ZERO_FIELD',
  'EMPTY_STRING',
  'NULL_FIELD'
];
var safeSubMapAgain = [
  'ANOTHER_FIELD'
];

var key = 'this_key';
var value = 'this_value';
var otherKey = 'invalid_key';
var invalidValue = null;

objectBuilder.map(oldObject, objectMap);
objectBuilder.map(oldObject, objectMap, {validate: true});
objectBuilder.mapTime(oldObject, timeMap);
objectBuilder.mapTime(oldObject, safeTimeMap, {validate: true});
objectBuilder.subMap(oldObject, subMap, {key: 'sub'});
objectBuilder.subMap(oldObject, subMapAgain, {key: 'sub'});
objectBuilder.subMap(oldObject, safeSubMap, {key: 'sub_safe', validate: 'true'});
objectBuilder.subMap(oldObject, safeSubMapAgain, {key: 'sub_safe', validate: 'true'});
objectBuilder.insert(key, value);
objectBuilder.insert(otherKey, invalidValue, {validate: true});

console.log(objectBuilder.toObject());
