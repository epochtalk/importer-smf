var path = require('path');
var epochMap = require(path.join(__dirname, 'epoch-map'));
var through2 = require('through2');

module.exports = function(mQ) {
  var table = 'smf_members';
  var tableMap = {
    memberName : 'username',
    emailAddress : 'email'
  }
  var smfFields = [
    'ID_MEMBER'
  ];

  var rowStream = mQ.createRowStream(table);
  var tr = through2.obj(function(row, enc, cb) {
    var obj = epochMap.remapObject(row, tableMap);
    var smfObject = {};
    smfFields.forEach(function(field) {
      smfObject[field] = row[field];
    });
    obj.smf = smfObject;
    this.push(obj);
    return cb();
  });
  userStream = rowStream.pipe(tr);

  return userStream;
}
