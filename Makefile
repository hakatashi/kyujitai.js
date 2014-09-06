REPORTER = nyan
DATA = data/kyuji.json data/douon.json

$(DATA): %.json: %.cson
	./node_modules/.bin/cson2json $< > $@

build: $(DATA)

test: build
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER)
