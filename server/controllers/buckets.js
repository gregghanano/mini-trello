var mongoose = require('mongoose');
var Bucket = mongoose.model('Buckets');
var User = mongoose.model('Users');

var buckets = {};
//code goes here
buckets.addBucket = function(req,res){
	var new_bucket = new Bucket({title: req.body.title});
	new_bucket.save(function(err, data){
		if (err) {
			console.log('you didnt save the bucket!');
		} else {
			Bucket.find({}, function(err, data2){
				if(err){
					console.log("ya'll fucked up tho");
				} else {
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
					res.json(data2);
				}
			})
		}
	})
}

buckets.addTask = function(req,res){
	Bucket.update({_id: req.params.id}, {$push: {bucket_tasks: req.body.task}}, function(err, data){
		if(err){
			console.log('didnt update the tasks');
		} else {
			Bucket.find({}, function(err, data2){
				if(err){
					console.log("ya'll fucked up tho");
				} else {
					res.json(data2);
				}
			})

		}
	})
}

buckets.removeTask = function(req, res){
	Bucket.update({_id: req.body._id}, {$pull: {bucket_tasks: req.params.id}}, function(err,data){
		if(err){
			console.log("didn't remove task");
		} else {
			Bucket.find({}, function(err, data2){
				if(err){
					console.log("ya'll fucked up tho");
				} else {
					res.json(data2);
				}
			})
		}
	})
}

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