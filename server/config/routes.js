var buckets = require('../controllers/buckets');
// var passport = require("passport");
// var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(app){
	app.get('/', function(req, res){
	res.render('index');
	})

	// app.get('/auth/facebook', passport.authenticate('facebook', {
	// 	scope: ['email']
	// }));

	// app.get('/auth/facebook/callback', buckets.oauthCallback('facebook'));

	app.post('/addBucket', function(req, res){
		buckets.addBucket(req, res);
	})

	app.get('/getBuckets', function(req, res){
		buckets.getBuckets(req, res);
	})

	app.put('/addTask/:id', function(req, res){
		buckets.addTask(req, res);
	})

	app.put('/removeTask/:id', function(req, res){
		buckets.removeTask(req, res);
	})

	// app.get('/auth/facebook', passport.authenticate('facebook'));
	// app.get('/auth/facebook/callback',
	// passport.authenticate('facebook', { successRedirect: '/index',
	// 									failureRedirect: '/login'}));

	app.post('/addUser', function(req, res){
		buckets.addUser(req,res);
	})

	app.get('/getUsers', function(req,res){
		buckets.getUsers(req,res);
	})

	app.delete('/removeBucket/:id', function(req, res){
		console.log('in the remove bucket routes');
		buckets.removeBucket(req,res);
	})

	// app.get('/addUser', function(req, res){
	// 	buckets.addUser(req,res);
	// })
}