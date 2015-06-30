
//'use strict';
/*var huaweiApp = angular.module('huaweiApp', ['huaweiApp.controllers','leaflet-directive']);

huaweiApp.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('', {
			controller: 'MainController',
			templateUrl: 'index.html',
			partial: ''
		})
		.when('/data', {
			controller: 'MainController',
			templateUrl: 'index.html',
			partial: ''
		})
		.otherwise({
			controller: 'MainController',
			template: '<div></div>',
			partial: ''
		});

	$locationProvider.html5Mode(true);
});*/

// huaweiApp.factory('sampleData', function ($q, $http) {
// 	var weatherData, bikeStations;
// 	return {
// 		getWeatherData: function () {
// 			var deferred = $q.defer();
// 			if (!weatherData) {
// 				$http.get('/data/weather'
// 				).success(function (data, status, headers, response) {
// 					weatherData = data;
// 					deferred.resolve(data);
// 				}).error(function (data, status, headers, response) {
// 					deferred.reject(status);
// 				});
// 			}
// 			return deferred.promise;
// 		}
// 		getBikeStationData: function () {
// 			var deferred = $q.defer();
// 			if (!bikeStations) {
// 				$http.get('/data/bikeStations'
// 				).success(function (data, status, headers, response) {
// 					bikeStations = data;
// 					deferred.resolve(data);
// 				}).error(function (data, status, headers, response) {
// 					deferred.reject(status);
// 				});
// 			}
// 			return deferred.promise;
// 		}
// 	};
// });


// huaweiApp.factory('bikeStationData', function ($q, $http) {
// 	var bikeStations;
// 	return {
// 		getBikeStations: function () {
// 			var deferred = $q.defer();
// 			if (!bikeStations) {
// 				$http.get('/data/bikeStations'
// 				).success(function (data, status, headers, response) {
// 					bikeStations = data;
// 					deferred.resolve(data);
// 				}).error(function (data, status, headers, response) {
// 					deferred.reject(status);
// 				});
// 			}
// 			return deferred.promise;
// 		}
// 	};
// });









