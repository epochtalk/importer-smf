SMF Importer Schema
===================

Each smf field is an object which contains legacy data from the original mysql
implementation.

SMF Boards -> Epoch Boards
--------------------------

<H3>Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
ID_BOARD | smf.board_id
name | name
description | description

<H3>Not Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
ID_CAT | (none)
childLevel | (none)
ID_PARENT | (none)
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
ID_BOARD | smf.board_id
ID_TOPIC | smf.thread_id
ID_FIRST_MSG | smf.post_id

<H4>Fields from First Message</H4>
SMF Field | Epoch mapping
----------|--------------
posterTime | created_at

<H3>Not Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
isSticky | (none)
ID_BOARD | (none)
ID_LAST_MSG | (none)
ID_MEMBER_STARTED | (none)
ID_MEMBER_UPDATED | (none)
ID_POLL | (none)
numReplies | (none)
numViews | (none)
locked | (none)
selfModerated | (none)


SMF Messages -> Epoch Posts
---------------------------

<H3>Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
ID_MSG | smf.post_id
posterTime | created_at
subject | title
body | body

<H3>Not Implemented</H3>

SMF Field | Epoch mapping
----------|--------------
ID_TOPIC | (none)
ID_BOARD | (none)
ID_MEMBER | (none)
ID_MSG_MODIFIED | (none)
posterName | (none)
posterEmail | (none)
posterIP | (none)
smileysEnabled | (none)
modifiedTime | (none)
modifiedName | (none)
icon | (none)
gpbp_score | (none)
