var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './client')));

//-------Facebook Passport--------
 // var passport = require('passport');
 // var FacebookStrategy = require('passport-facebook').Strategy;
 // var buckets = require('./server/controllers/buckets');
 // module.exports = function() {
 // 	passport.use(new FacebookStrategy({
 // 	clientID: 1409053019396161,
 // 	clientSecret: '4bc9b02fa6a07f7115dd669edb0f04ba',
 // 	callbackURL: "http://localhost:4000/auth/facebook/callback"
 // 	},
 // 	function(accessToken, refreshToken, profile, done) {
 // 		console.log('hello world!');
 // 		console.log("profile stuff/////", profile);
 // 		console.log(done, 'this is the done param/////');
 // 		User.findOrCreate({facebookID: profile.id, displayName: profile.displayName, first_name: profile.givenName}, function(err, user) {
 // 			if (err) { return done(err); }
 // 		 	    done(null, user);
 // 		 	 });
 //   		}
 // 	));

 // }

 // app.get('/auth/facebook', passport.authenticate('facebook'));
	// app.get('/auth/facebook/callback',
	// passport.authenticate('facebook', { successRedirect: '/index',
	// 									failureRedirect: '/login'}));
//-------------End Facebook---------------------

require('./server/config/mongoose');

require('./server/config/routes')(app);

var server = app.listen(4000, function(){
	console.log('Listening on port 4000');
})
//-------- Sockets ---------------------

var io = require('socket.io').listen(server);
var messages =[];
var online_users = [];

io.sockets.on('connection', function(socket){
	function localVar(){
		var user = '';
		var index = 0;

		console.log('we are using sockets!');
		socket.on('signed_in', function(data){
			console.log(data, 'signed_in socket');
		})
		socket.on('new_message', function(data){
			messages.push(data);
			//console.log(data);
			io.emit('new_message', data);
		})

		socket.on('update_bucket', function(data){
			//console.log(data, "factory socket data");
			io.emit('show_buckets', data);
		})

		socket.on('update_task', function(data){
			//console.log(data, "factory socket data");
			io.emit('show_task', data);
		})
		socket.on('user_entered', function(data){
			user = data.givenName;
			console.log(user, "after user entered");
			online_users.push(user);
			index = online_users.indexOf(user);
			console.log(index);
			console.log("Online_users ////", online_users);
			io.emit('new_user', {data:online_users});
		});

		socket.on('remove_bucket', function(data){
			io.emit('removed_one_bucket', data);
		})
		socket.on('removed_task', function(data){
			io.emit('removed_one_task', data);
		})

		socket.on('disconnect', function(){
			console.log(online_users, "online users////");
			console.log(index, "disonnect index!");
			online_users.splice(index, 1);
			console.log(online_users, "after the splice!");
		})
	};
	localVar();
})