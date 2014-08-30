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
  var columns = [
    'pm_ignore_list',
    'AIM',
    'ignoreBoards',
    'ICQ',
    'secretAnswer',
    'ID_MSG_LAST_VISIT',
    'smileySet',
    'YIM',
    'lngfile',
    'activity',
    'messageLabels',
    'additionalGroups',
    'timeFormat',
    'notifyTypes',
    'ID_POST_GROUP',
    'MSN',
    'avatar',
    'buddy_list',
    'memberName',
    'gpbp_respect',
    'posts',
    'ID_THEME',
    'lastpatrolled',
    'regIP',
    'memberIP',
    'autoWatch',
    'maxdepth',
    'hideEmail',
    'usertitle',
    'gender',
    'showOnline',
    'pm_email_notify',
    'ID_GROUP',
    'karmaGood',
    'websiteUrl',
    'birthdate',
    'notifyAnnouncements',
    'realName',
    'unreadMessages',
    'notifyOnce',
    'validation_code',
    'memberIP2',
    'lastLogin',
    'instantMessages',
    'dateRegistered',
    'ign_ignore_list',
    'ID_MEMBER',
    'is_activated',
    'karmaBad',
    'secretQuestion',
    'personalText',
    'proxyban',
    'timeOffset',
    'notifySendBody',
    'websiteTitle',
    'signature',
    'location',
    'totalTimeLoggedIn',
    'emailAddress'
  ];

  var rowStream = mQ.createRowStream(table, columns);
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