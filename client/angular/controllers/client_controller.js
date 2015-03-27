myApp.controller('bucketsController', function ($scope, $location, bucketFactory, $routeParams, localStorageService){
	var socket = io.connect('https://minitrello.herokuapp.com/');
	$scope.buckets = [];
	// console.log($scope.buckets);
	$scope.title = '';
	$scope.tasks = [];
	$scope.user = localStorageService.get('name');
	$scope.connected_users = [];
	$scope.users = [];

//------UI sortable ----------------
	$scope.lists = $scope.buckets;
	console.log($scope.lists, "Scope lists!");

	$scope.sortingLog = [];

	$scope.sortableOptions = {
	  // called after a node is dropped
	  stop: function(e, ui) {
	  	console.log("controller stop function in sortable options");
	    var logEntry = {
	      ID: $scope.sortingLog.length + 1,
	      //Text: 'Moved element: ' + ui.item.scope().item.text
	    };
	    $scope.sortingLog.push('logEntry = ', logEntry);
	  }
	};


//-------instant and socket functions---------
	bucketFactory.getBuckets(function(data){
		$scope.buckets = data;
	});
	bucketFactory.getUsers(function(data){
		$scope.users = data
	})
	
	socket.on('new_user', function(data){
		console.log(data, "new user data sent from sockets user_entered");
		$scope.connected_users.push(data);
		//run Bucket Factory function
	})
	// socket.on('online_users', function(data){
	// 	console.log(data, "data from socket online_users");
	// })
	socket.on('show_task', function(data){
		bucketFactory.getBuckets(function(data){
		$scope.buckets = data;
		})
	});
	socket.on('show_buckets', function(data){
		bucketFactory.getBuckets(function(data){
		$scope.buckets = data;
		})
	});
	socket.on('removed_one_bucket', function(data){
		bucketFactory.getBuckets(function(data){
		$scope.buckets = data;
		})
	});

	socket.on('removed_one_task', function(data){
		bucketFactory.getBuckets(function(data){
		$scope.buckets = data;
		})
	});

	//------------ Buckets -------------------
	$scope.addBucket = function(){
		//console.log($scope.newBucket, 'this is the controller add bucket');
		bucketFactory.addFactoryBucket($scope.newBucket, function(data){
			//console.log(data, 'data in the add bucket controller');
			socket.on('show_buckets', function(data){
				// $scope.buckets = data;
				bucketFactory.getBuckets(function(data){
					$scope.buckets = data;
				});
			})
			$scope.newBucket = {};
		});
	}

	$scope.removeBucket = function(bucket){
		console.log($scope.buckets.indexOf(bucket));
		console.log('you can remove the bucket!');
		var index = $scope.buckets.indexOf(bucket);
		var oneBucket = $scope.buckets[index];
		bucketFactory.removeFactoryBucket(oneBucket._id, oneBucket, function(data){
			socket.on('removed_one_bucket', function(data){
					bucketFactory.getBuckets(function(data){
					$scope.buckets = data;
					})
				});
		})
	}

	//---------------TASKS----------------------------

	$scope.addTask = function(bucket, newTask){
		//console.log($scope.buckets.indexOf(bucket), 'index passed through add task');
		var index = $scope.buckets.indexOf(bucket);
		var oneBucket = $scope.buckets[index];
		// console.log(oneBucket, "oneBucket variable");
		// console.log(oneBucket._id);
		// console.log(newTask, '= newTask parameter');
		bucketFactory.addFactoryTask(oneBucket._id, newTask, function(data){
			//console.log(data, 'callback data from Factory');
			socket.on('show_task', function(data){
				// $scope.buckets = data;
				bucketFactory.getBuckets(function(data){
					$scope.buckets = data;
				});
			})
			$scope.newTask = {};
		})
	}

	$scope.removeTask = function(bucket, task){
		console.log('task to be removed', task);
		var bucketIndex = $scope.buckets.indexOf(bucket);
		var oneBucket = $scope.buckets[bucketIndex];
		console.log(bucketIndex);
		console.log(oneBucket);
		bucketFactory.removeBucketTask(oneBucket, task, function(data){
		 	console.log("back in the controller");
		})
		// oneBucket.bucket_tasks.splice($index, 1);
		// socket.emit("delete_task");
	}
	//--------------USERS------------------
	$scope.addUser = function(){
		console.log($scope.newUser, "adding a new user");
		bucketFactory.addFactoryUsers($scope.newUser, function(data){
			localStorageService.set('name', data.givenName);
			console.log(data);
			//socket.emit("user_entered", data);
			$location.path('/buckets');

		})
	}
});