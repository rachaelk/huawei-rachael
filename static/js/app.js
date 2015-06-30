var huaweiApp = angular.module('huaweiApp', ['leaflet-directive']);

huaweiApp.factory('sampleData', function ($q, $http) {
  var weatherData, bikeStations;
  return {
    getWeatherData: function () {
      var deferred = $q.defer();
      if (!weatherData) {
        $http.get('/data/weather'
        ).success(function (data, status, headers, response) {
          weatherData = data;
          deferred.resolve(data);
        }).error(function (data, status, headers, response) {
          deferred.reject(status);
        });
      }
      return deferred.promise;
    }
    /*getBikeStationData: function () {
      var deferred = $q.defer();
      if (!bikeStations) {
        $http.get('/data/bikeStations'
        ).success(function (data, status, headers, response) {
          bikeStations = data;
          deferred.resolve(data);
        }).error(function (data, status, headers, response) {
          deferred.reject(status);
        });
      }
      return deferred.promise;
    }*/
  };
});


huaweiApp.factory('bikeStationData', function ($q, $http) {
  var bikeStations;
  return {
    getBikeStations: function () {
      var deferred = $q.defer();
      if (!bikeStations) {
        $http.get('/data/bikeStations'
        ).success(function (data, status, headers, response) {
          bikeStations = data;
          deferred.resolve(data);
        }).error(function (data, status, headers, response) {
          deferred.reject(status);
        });
      }
      return deferred.promise;
    }
  };
});


huaweiApp.controller('MainController', function($scope, $log, $http, bikeStationData){

var style = function (feature) {
    return {
      color: '#000',
      opacity: 1,
      fillColor: '#FF6600',
      fillOpacity: 0.8,
      weight: 1,
      radius: 6,
      clickable: true
    }
  };

  bikeStationData.getBikeStations().then(function (data) {
    $scope.geojson = data.features[0];
    $scope.stations = {
      data: data,
      pointToLayer: function (feature, latlng) {
        return new L.circleMarker(latlng, style(feature));
      }
    }
  });

  angular.extend($scope, {

    tiles: {
      name: 'Mapbox Park',
      url: 'http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token={apikey}',
      type: 'xyz',
      options: {
          apikey: 'pk.eyJ1Ijoia2VydWlxaXUiLCJhIjoiMDlhYTc1OTQ4M2ExYjU2NTMwNzA1OGEwMGNiMmY0Y2QifQ.cwg1kVVOBUgcbB4lk_uv4g'
        }         
    },
    maxbounds: {
      northEast: {
        lat: 39.6268,
        lng: -76.0597
      },
      southWest: {
        lat: 38.5439,
        lng: -77.5896
      }
    },
    dc: {
      lat: 38.9047,
      lng: -77.0164,
      zoom:14
    },
    defaults: {
      maxZoom: 18,
      minZoom: 10
    }
  });

  $scope.$on('leafletDirectiveGeoJson.click', function (ev, leafletPayload) {
    console.log(leafletPayload.model.properties.name);
  });


});

huaweiApp.controller('MainController2', function ($scope, sampleData) {
  $scope.text = 'Hello this is app';
  sampleData.getWeatherData().then(function (data) {
    $scope.information = data;
  });
});


huaweiApp.controller('404Controller', function () {
	window.location.pathname = '404';
});