var http = require("http");
var url = require('url');
var fs = require('fs');

function start(port) {
  if(typeof(port) === 'undefined')
    port = 8080;

  var server = http.createServer(function(request, response){
    var pathname = url.parse(request.url).pathname;
    if(pathname === '/')
      pathname = '/index.html';

    fs.readFile('.' + pathname, function(err, data) {
      if(err) {
          response.writeHead(500);
          return response.end('找不到檔案： ' + pathname);
      } else {
          response.writeHead(200);
          response.end(data);
      }
    });
  });

	server.listen(port, function(){
    console.log("Server has started at: " + port);
  });

  require('./socket').create(server);
};

exports.start = start;