all: clean
	time ./epoch-smf-import.sh
	./finished.sh

debug: clean
	time ./epoch-smf-import.sh --quiet --debug
	./finished.sh

clean:
	rm -rf epoch.db
