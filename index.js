var server = require('./server');

var port = 8080; //default

if (process.argv.indexOf("--port") >= 0) {
	var idx = process.argv.indexOf("--port")+1;
	port = process.argv[idx];
};


server.start(port);
