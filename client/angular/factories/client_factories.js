myApp.factory('bucketFactory', function($http){
	var socket = io.connect();
	var buckets = [];
	var users = [];

	var factory = {};

	factory.getBuckets = function(callback){
		$http.get('/getBuckets').success(function(output){
			buckets = output;
			callback(output);
		})
	}

	factory.getUsers = function(callback){
		$http.get('/getUsers').success(function(output){
			users = output;
			callback(output);
		})
	}

	socket.on("update_task", factory.getBuckets = function(callback){
		$http.get('/getBuckets').success(function(output){
			buckets = output;
			callback(output);
		})
	})

	factory.addFactoryBucket = function(data, callback){
		$http.post('/addBucket', data).success(function(output){
			socket.emit("update_bucket", {buckets: output});
			callback(output);
		})
	}

	factory.removeFactoryBucket = function(id, data, callback){
		$http.delete('/removeBucket/'+id, data).success(function(output){
		 	socket.emit('remove_bucket', {buckets: output});
		 	callback(output);

		})
	}
	//-------------TASKS------------------
	factory.addFactoryTask = function(id, data, callback){
		$http.put('/addTask/'+id, data).success(function(output){
			socket.emit("update_task", {buckets: output});
			callback(output);
		})
	}
	factory.removeBucketTask = function(data, task, callback){
		var id = data._id;
		$http.put('/removeTask/'+ task, data).success(function(output){
			socket.emit("removed_task", {buckets: output});
			callback(output);
		})
	}
	//-------------USERS------------------
	factory.addFactoryUsers = function(data, callback){
		$http.post('/addUser', data).success(function(output){
			socket.emit('user_entered', output);
			users.push(output);
			callback(output);
		})
	}

	return factory;

});