all: clean
	time node --max-old-space-size=8192 index --log log.txt
	./finished.sh

debug: clean
	time node --max-old-space-size=8192 index --log log.txt --quiet --debug
	./finished.sh

clean:
	rm -rf epoch.db log.txt
