var fs = require('fs');

function create(server){
	var io = require('socket.io').listen(server);
	var msg_queue = [];

	io.sockets.on('connection', function(socket) {
	  console.log("A user connected, socket id: " + socket.id);

	  for(var idx in msg_queue){
	  	socket.emit('echo_back', msg_queue[idx]);
	  	if(idx > 30)
	  		break;
	  }

	  socket.on('disconnect', function () {
	    console.log("A user disconnect, socket id: " + socket.id);
	  });

	  socket.on('echo_post', function(name, data){
	  	if (data.length <= 1)
	  		return;

	  	var date = new Date();
	  	console.log("A user echo post, socket id: [" + socket.id + "], name: [" + name + "], data" + ": [" + data + "]");
	  	fs.appendFile('message.txt', data+"<br>", function (err) {});

	  	var echo_msg = "<big>" + name + "&nbsp;說:&nbsp;" + data + "</big><small><i>&nbsp;at&nbsp;<time>" + date.getHours() + ":" + date.getMinutes() + "</time></i></small>"
	  	io.sockets.emit("echo_back", echo_msg);
	  	msg_queue.push(echo_msg);
	  });


	  setInterval(function(){
	  	if(msg_queue.length > 60){
	  		// msg_queue.shift();
	  		msg_queue = msg_queue.slice(msg_queue.length-45, msg_queue.length)
	  	}
	  }, 30*60*1000);
	});
}

exports.create = create;