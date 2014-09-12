all: clean
	node index -d --color --verbose

forum: clean
	cp -R users.db epoch.db
	time node --max-old-space-size=8192 index -d --color --verbose --forum --log log.txt
	./finished.sh

crazy: clean
	node index -d --color crazy

clean:
	rm -rf epoch.db
