myApp.controller('bucketsController', function ($scope, $location, bucketFactory, $routeParams, localStorageService){
	var socket = io.connect();
	$scope.buckets = [];
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
	})

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
		bucketFactory.addFactoryBucket($scope.newBucket, function(data){
			socket.on('show_buckets', function(data){
				bucketFactory.getBuckets(function(data){
					$scope.buckets = data;
				});
			})
			$scope.newBucket = {};
		});
	}

	$scope.removeBucket = function(bucket){
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
		var index = $scope.buckets.indexOf(bucket);
		var oneBucket = $scope.buckets[index];
		bucketFactory.addFactoryTask(oneBucket._id, newTask, function(data){
			socket.on('show_task', function(data){
				bucketFactory.getBuckets(function(data){
					$scope.buckets = data;
				});
			})
			$scope.newTask = {};
		})
	}

	$scope.removeTask = function(bucket, task){
		var bucketIndex = $scope.buckets.indexOf(bucket);
		var oneBucket = $scope.buckets[bucketIndex];
		bucketFactory.removeBucketTask(oneBucket, task, function(data){
		 	console.log("back in the controller");
		})
	}
	//--------------USERS------------------
	$scope.addUser = function(){
		console.log($scope.newUser, "adding a new user");
		bucketFactory.addFactoryUsers($scope.newUser, function(data){
			localStorageService.set('name', data.givenName);
			console.log(data);
			$location.path('/buckets');

		})
	}
});