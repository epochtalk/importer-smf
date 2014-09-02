all: clean users_again forum

users:
	node test_drivers/test-user-import -d
	cp -R epoch.db users.db

users_again: clean
	cp -R users.db epoch.db

forum:
	node test_drivers/test-smf-import -d

clean:
	rm  -rf epoch.db

real_clean: clean
	rm -rf users.db
