all: clean
	time node --max-old-space-size=8192 index --log log.txt
	./finished.sh

clean:
	rm -rf epoch.db log.txt
