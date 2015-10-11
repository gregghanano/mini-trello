var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './client')));

require('./server/config/mongoose');

require('./server/config/routes')(app);

var server = app.listen(4000, function(){
	console.log('Listening on port 4000');
})
//-------- Sockets ----------------------

var io = require('socket.io').listen(server);
var messages =[];
var online_users = [];

io.sockets.on('connection', function(socket){
	function localVar(){
		var user = '';
		var index = 0;

		console.log('we are using sockets!');
		socket.on('signed_in', function(data){
		})
		socket.on('new_message', function(data){
			messages.push(data);
			io.emit('new_message', data);
		})

		socket.on('update_bucket', function(data){
			io.emit('show_buckets', data);
		})

		socket.on('update_task', function(data){
			io.emit('show_task', data);
		})
		socket.on('user_entered', function(data){
			user = data.givenName;
			online_users.push(user);
			index = online_users.indexOf(user);
			io.emit('new_user', {data:online_users});
		});

		socket.on('remove_bucket', function(data){
			io.emit('removed_one_bucket', data);
		})
		socket.on('removed_task', function(data){
			io.emit('removed_one_task', data);
		})

		socket.on('disconnect', function(){
			online_users.splice(index, 1);
		})
	};
	localVar();
})