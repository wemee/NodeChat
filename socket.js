var fs = require('fs');

function create(server){
	var io = require('socket.io').listen(server);
	var msg_queue = [];
	var users = {};

	var slimMsg = function(){
  	if(msg_queue.length > 20){
  		msg_queue = msg_queue.slice(msg_queue.length-15, msg_queue.length);
  	}
  };

  var emitAllMsgTo = function(socket){
  	for(var idx in msg_queue){
	  	socket.emit('echo_back', msg_queue[idx]);
	  }
  }

  setInterval(function(){
	 	slimMsg();
	}, 30*60*1000);

	io.sockets.on('connection', function(socket) {
	  console.log("A user connected, socket id: " + socket.id);
	  users[socket.id] = socket.handshake.address.address;
	  console.log(users);

	  slimMsg();
	  emitAllMsgTo(socket);

	  socket.on('disconnect', function () {
	    console.log("A user disconnect, socket id: " + socket.id);
	    delete users[socket.id];
	  });

	  socket.on('echo_post', function(name, data){
	  	var date = new Date();
	  	console.log("A user echo post, socket id: [" + socket.id + "], name: [" + name + "], data" + ": [" + data + "]");
	  	fs.appendFile('message.txt', data+"<br>", function (err) {});

	  	var echo_msg = "<big>" + name + "&nbsp;說:&nbsp;" + data + "</big><small><i>&nbsp;at&nbsp;<time>" + date.getHours() + ":" + date.getMinutes() + "</time></i></small>"
	  	io.sockets.emit("echo_back", echo_msg);
	  	msg_queue.push(echo_msg);
	  });
	});
}

exports.create = create;