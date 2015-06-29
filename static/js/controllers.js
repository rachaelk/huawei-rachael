var controllers = angular.module('huaweiApp.controllers', []);

controllers.controller('MainController',   ['$scope', '$log', '$http', 
    function($scope, $log, $http ){
$scope.getResults = function() {
      $log.log("test");
      var userInput = $scope.input_route;
      if ((userInput == 'bike stations') || (userInput == 'Bike Stations' || userInput == 'Bike stations')) {
        userInput = 'bikeStations';
      }

      // fire the API request
      $http.get('/data/' + userInput).
        success(function(data, status, headers, config) {
          $scope.information = data;

        }).
        error(function(data, status, headers, config) {
          $log.log(status);
        });

    };



  }
  
  ]);


controllers.controller('404Controller', function () {
	window.location.pathname = '404';
});