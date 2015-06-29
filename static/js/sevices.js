var services = angular.module('huaweiApp.services', []);

services.factory('notificationService',['$rootScope', function($rootScope) {

    var notificationService = {
        subscribe : function() {
             setInterval(function(){
                 console.log("some event happend and broadcasted");
                 $rootScope.$broadcast('event', true);
                 // angular does not know about this 
                 //$rootScope.$apply();
             }, 5000);
        }
    };
    return notificationService;
}]);