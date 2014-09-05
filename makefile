all: clean forum

forum:
	node test_drivers/test-smf-import -d

clean:
	rm  -rf epoch.db
