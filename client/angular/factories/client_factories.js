myApp.factory('bucketFactory', function($http){
	var socket = io.connect('https://minitrello.herokuapp.com/');
	var buckets = [];
	var users = [];
	// console.log(buckets);

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
		//console.log(data, 'this is the factory add data');
		$http.post('/addBucket', data).success(function(output){
			//console.log(output, 'factory output');
			socket.emit("update_bucket", {buckets: output});
			callback(output);
		})
	}

	factory.removeFactoryBucket = function(id, data, callback){
		console.log('factory remove ID ', id);
		console.log('factory remove data ', data);
		$http.delete('/removeBucket/'+id, data).success(function(output){
		 	console.log('back in the factory');
		 	socket.emit('remove_bucket', {buckets: output});
		 	callback(output);

		})
	}
	//-------------TASKS------------------
	factory.addFactoryTask = function(id, data, callback){
		//console.log(id, "= bucket id in factory");
		//console.log(data, "= task data in factory");
		$http.put('/addTask/'+id, data).success(function(output){
			//console.log("this is the data2 output from server controller///", output, "/////end of output");
			socket.emit("update_task", {buckets: output});
			callback(output);
		})
	}
	factory.removeBucketTask = function(data, task, callback){
		// console.log(data, "data");
		// console.log(index);
		console.log(data._id);
		var id = data._id;
		$http.put('/removeTask/'+ task, data).success(function(output){
			socket.emit("removed_task", {buckets: output});
			callback(output);
		})
	}
	//-------------USERS------------------
	factory.addFactoryUsers = function(data, callback){
		console.log("user add data = ", data);
		$http.post('/addUser', data).success(function(output){
			console.log('this is the FB output', output);
			socket.emit('user_entered', output);
			users.push(output);
			callback(output);
		})
	}

	return factory;

});