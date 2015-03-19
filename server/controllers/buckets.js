var mongoose = require('mongoose');
var Bucket = mongoose.model('Buckets');
var User = mongoose.model('Users');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var buckets = {};
//code goes here
buckets.addBucket = function(req,res){
	//console.log(req.body.title, 'added bucket req.body');
	var new_bucket = new Bucket({title: req.body.title});
	//console.log('new_bucket variable = ', new_bucket);
	new_bucket.save(function(err, data){
		if (err) {
			console.log('you didnt save the bucket!');
		} else {
			//console.log('saved bucket data = ', data);
			Bucket.find({}, function(err, data2){
				if(err){
					console.log("ya'll fucked up tho");
				} else {
					//console.log("Beginning of data2////////", data2, "///////This is the data2 end");
					res.json(data2);
				}
			})
		}
	})
}

buckets.getBuckets = function(req, res){
	Bucket.find({}, function(err, data){
		if(err){
			console.log('you didnt find buckets');
		} else {
			//console.log(data, 'get buckets data');
			res.json(data);
		}
	})
}

buckets.removeBucket = function(req, res){
	Bucket.remove({_id: req.params.id}, function(err, data){
		if(err){
			console.log('didnt delete bucket');
		} else {
			Bucket.find({}, function(err, data2){
				if(err){
					console.log("ya'll fucked up tho");
				} else {
					//console.log("Beginning of data2////////", data2, "///////This is the data2 end");
					res.json(data2);
				}
			})
		}
	})
}

buckets.addTask = function(req,res){
	// console.log(req.params.id, "= req.params.id");
	// console.log(req.body, "=req.body");
	// console.log(req.body.task, "=req.body.task");
	Bucket.update({_id: req.params.id}, {$push: {bucket_tasks: req.body.task}}, function(err, data){
		if(err){
			console.log('didnt update the tasks');
		} else {
			//console.log(data, "res.json data");
			Bucket.find({}, function(err, data2){
				if(err){
					console.log("ya'll fucked up tho");
				} else {
					//console.log("Beginning of data2////////", data2, "///////This is the data2 end");
					res.json(data2);
				}
			})

		}
	})
}

buckets.removeTask = function(req, res){
	// console.log(req, "req in removeTask");
	// console.log("bucket ID ///// ", req.body._id);
	Bucket.update({_id: req.body._id}, {$pull: {bucket_tasks: req.params.id}}, function(err,data){
		if(err){
			console.log("didn't remove task");
		} else {
			Bucket.find({}, function(err, data2){
				if(err){
					console.log("ya'll fucked up tho");
				} else {
					//console.log("Beginning of data2////////", data2, "///////This is the data2 end");
					res.json(data2);
				}
			})
		}
	})
}
// buckets.oauthCallback = function(strategy){
// 	return function(req, res, next){
// 		var strategy = function() {
//  			passport.use(new FacebookStrategy({
//  			clientID: 1409053019396161,
//  			clientSecret: '4bc9b02fa6a07f7115dd669edb0f04ba',
//  			callbackURL: "http://localhost:4000/auth/facebook/callback"
//  			},
//  			function(req, accessToken, refreshToken, profile, done) {
//  				console.log('hello world!');
//  				console.log("profile stuff/////", profile);
//  				console.log(done, 'this is the done param/////');
//  				User.findOrCreate({facebookID: profile.id, displayName: profile.displayName, first_name: profile.givenName}, function(err, user) {
//  					if (err) { return done(err); }
//  		 	   			 done(null, user);
//  		 	 });
//    		}
//  	));

//  }
// 		passport.authenticate(strategy, function(err, user, redirectURL){
// 			if (err || !user){
// 				return res.redirect('/#/login');
// 			}
// 			req.login(user, function(err){
// 				if(err){
// 					return res.redirect('/#/login');
// 				}
// 				return res.redirect(redirectURL || '/')
// 			});
// 		})(req, res, next);
// 	}
// }

buckets.addUser = function(req, res){
	console.log("////////", req.body, "req.body")
	console.log("Display Name///// ", req.body.displayName);
	User.findOne({displayName: req.body.displayName}, function(err, data){
		if(data === null){
			console.log(err, "err");
			console.log('this is a new user!');
			var new_user = new User({displayName: req.body.displayName, givenName: req.body.givenName});
			new_user.save(function(err, data){
				if(err){
					console.log('user couldnt be saved');
				} else {
					console.log(data, "/////new user data");
					res.json(data);
				}
			})

		} else {
			res.json(data);
		}
			// var new_user = new User({facebookID: req.body.facebookID, displayName: req.body.displayName, givenName: req.body.givenName});
			// console.log('new_user/////', new_user);
			// new_user.save(function(err, data2){
			// 	if(err){
			// 		console.log("you got an error mothafukaa");
			// 	} else {
			// 		User.find({}, function(err, data2){
			// 			res.json(data2)
			// 		});
			// 	}
			// })
	})
}

buckets.getUsers = function(req,res){
	User.find({}, function(err, data){
		if(err){
			console.log('didnt get users foo');
		} else {
			res.json(data);
		}
	})
}


module.exports = buckets;