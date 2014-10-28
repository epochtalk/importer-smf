var path = require('path');
var EpochCollection = require(path.join(__dirname, 'epoch-collection'));
var through2 = require('through2');

module.exports = function(querier) {
  var table = 'smf_members';
  var tableMapSafe = {
    memberName : 'username',
    emailAddress : 'email',
    realName: 'name',
    //gender: 'gender',
    birthdate: 'dob',
    websiteUrl: 'website',
    location: 'location',
    signature: 'signature',
    avatar: 'avatar'
  };
  var timeMapSafe = {
    lastLogin: 'updated_at',
    dateRegistered : 'created_at'
  };
  var smfMap = [
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

  var options = {};
  options.columns = columns;
  options.orderBy = 'ID_MEMBER';

  var rowStream = querier.createRowStream(table, options);
  var tr = through2.obj(function(row, enc, cb) {
    var epochCollection = new EpochCollection();
    epochCollection.map(row, tableMapSafe, {validate: true});
    epochCollection.mapTime(row, timeMapSafe, {validate: true});
    epochCollection.subMap(row, smfMap, {key: 'smf'});
    this.push(epochCollection.collection);
    return cb();
  });
  var userStream = rowStream.pipe(tr);

  return userStream;
};
