var myApp = angular.module('myApp', ['ngRoute','LocalStorageModule', 'ui.sortable'])

myApp.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'partials/login.html'
	})
	.when('/buckets',{
		templateUrl: 'partials/buckets.html'
	})
	.otherwise({
		redirectTo: '/partials/login.html'
	})
});