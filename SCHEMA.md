SMF Importer Schema
===================

Each smf field is an object which contains legacy data from the original mysql
implementation.

SMF Boards -> Epoch Boards
--------------------------

<H3>Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
ID_BOARD | smf.ID_BOARD
ID_CAT | smf.ID_CAT
ID_PARENT | smf.ID_PARENT
childLevel | smf.childLevel
name | name
description | description

<H3>Not Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
boardOrder | (none)
ID_LAST_MSG | (none)
ID_MSG_UPDATED | (none)
memberGroups | (none)
numTopics | (none)
numPosts | (none)
countPosts | (none)
ID_THEME | (none)
permission_mode | (none)
override_theme | (none)
enable_gpbp | (none)
allowIgnore | (none)


SMF Topics -> Epoch Threads
---------------------------

<H3>Implemented</H3>

<H4>Fields from Topic</H4>
SMF Field | Epoch mapping
----------|--------------
ID_TOPIC | smf.ID_TOPIC
ID_FIRST_MSG | smf.ID_FIRST_MSG
ID_BOARD | smf.ID_BOARD
numViews | view_count

<H3>Not Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
isSticky | (none)
ID_LAST_MSG | (none)
ID_MEMBER_STARTED | (none)
ID_MEMBER_UPDATED | (none)
ID_POLL | (none)
numReplies | (none)
locked | (none)
selfModerated | (none)


SMF Messages -> Epoch Posts
---------------------------

<H3>Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
ID_MSG | smf.ID_MSG
ID_TOPIC | smf.ID_TOPIC
ID_MEMBER | smf.ID_MEMBER
posterTime | created_at
modifiedTime | updated_at
subject | title
body | body

<H3>Not Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
ID_BOARD | (none)
ID_MSG_MODIFIED | (none)
posterName | (none)
posterEmail | (none)
posterIP | (none)
smileysEnabled | (none)
modifiedName | (none)
icon | (none)
gpbp_score | (none)


SMF Members -> Epoch Users
--------------------------

<H3>Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
ID_MEMBER | smf.ID_MEMBER
dateRegistered | created_at
memberName | username
emailAddress | email

<H3>Not Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
posts | (none)
ID_GROUP | (none)
lngfile | (none)
lastLogin | (none)
realName | (none)
instantMessages | (none)
unreadMessages | (none)
buddy_list | (none)
pm_ignore_list | (none)
ign_ignore_list | (none)
messageLabels | (none)
passwd | (none)
personalText | (none)
gender | (none)
birthdate | (none)
websiteTitle | (none)
websiteUrl | (none)
location | (none)
ICQ | (none)
AIM | (none)
YIM | (none)
MSN | (none)
hideEmail | (none)
showOnline | (none)
timeFormat | (none)
signature | (none)
timeOffset | (none)
avatar | (none)
pm_email_notify | (none)
karmaBad | (none)
karmaGood | (none)
usertitle | (none)
notifyAnnouncements | (none)
notifyOnce | (none)
notifySendBody | (none)
notifyTypes | (none)
memberIP | (none)
memberIP2 | (none)
secretQuestion | (none)
secretAnswer | (none)
ID_THEME | (none)
is_activated | (none)
validation_code | (none)
ID_MSG_LAST_VISIT | (none)
additionalGroups | (none)
smileySet | (none)
ID_POST_GROUP | (none)
totalTimeLoggedIn | (none)
passwordSalt | (none)
gpbp_respect | (none)
ignoreBoards | (none)
autoWatch | (none)
maxdepth | (none)
activity | (none)
lastpatrolled | (none)
proxyban | (none)
regIP | (none)
