all: clean forum

forum:
	node index -d --color

crazy: clean
	node index -d --color crazy

clean:
	rm  -rf epoch.db
