server:
	node app.js
supervisor:
	./node_modules/.bin/supervisor app.js 2> /dev/null
ws:
	./node_modules/.bin/supervisor ws.js 2> /dev/null
start:
	sh script/appctl.sh start
stop:
	sh script/appctl.sh stop
restart:
	sh script/appctl.sh restart
test-all:
	find test -name 'test*.js' | NODE_ENV=mocha xargs ./node_modules/.bin/mocha --reporter spec $(color)
model:
	perl script/create_initial_file.pl model $(name)
service:
	perl script/create_initial_file.pl service $(name)
controller:
	perl script/create_initial_file.pl controller $(name)
test-model:
	perl script/create_initial_file.pl test_model $(name)
test-service:
	perl script/create_initial_file.pl test_service $(name)
load-data:
	sh script/import_xlsx_to_db.sh $(master)
load-text:
	node script/import_text.js
