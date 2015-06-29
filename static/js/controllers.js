var controllers = angular.module('huaweiApp.controllers', []);

controllers.controller('MainController', function($scope, $log, $http, bikeStationData){
$scope.getResults = function() {
    bikeStationData.getBikeStations().then(function (data) {
      $scope.information = data;
    })
});

controllers.controller('MainController2', function ($scope, sampleData) {
  $scope.text = 'Hello this is app';
  sampleData.getWeatherData().then(function (data) {
    $scope.data = data;
  });
});



controllers.controller('404Controller', function () {
	window.location.pathname = '404';
});