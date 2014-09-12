all: clean
	node index -d --color --verbose

forum: clean
	cp -R users.db epoch.db
	time node --max-old-space-size=8192 index -d --color --verbose --forum --log log.txt
	./finished.sh

otherforum: clean
	cp -R users.db other.db
	time node --max-old-space-size=8192 index -d --color --verbose --forum --leveldb other.db --log other_log.txt
	./finished.sh

users: real_clean
	time node --max-old-space-size=8192 index -d --color --verbose --users --leveldb users.db
	./finished.sh

crazy: clean
	node index -d --color crazy

clean:
	rm -rf epoch.db

real_clean: clean
	rm -rf users.db
