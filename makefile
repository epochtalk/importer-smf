all: clean
	time node --max-old-space-size=8192 index --color --verbose --log log.txt
	./finished.sh

forum: clean
	cp -R users.db epoch.db
	time node --max-old-space-size=8192 index --color --verbose --forum --log forumlog.txt
	./finished.sh

otherforum: clean
	cp -R users.db other.db
	time node --max-old-space-size=8192 index --color --verbose --forum --leveldb other.db --log other_log.txt
	./finished.sh

users: real_clean
	time node --max-old-space-size=8192 index --color --verbose --users --leveldb users.db --log userlog.txt
	./finished.sh

crazy: clean
	time node --max-old-space-size=8192 index --color crazy --verbose --log log.txt
	./finished.sh

clean:
	rm -rf epoch.db log.txt forumlog.txt

clean_users:
	rm -rf user.db userlog.txt

clean_other:
	rm -rf other.db other_log.txt

real_clean: clean clean_users clean_other
