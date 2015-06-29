
//'use strict';

var huaweiApp = angular.module('huaweiApp',
	['huaweiApp.directives', 'huaweiApp.controllers']);

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
		/*.when('/courses/:data/intro', {
			controller: 'CourseIntroController',
			templateUrl: '/static/html/main.html',
			partial: 'intro'
		})*/
		.otherwise({
			controller: 'MainController',
			template: '<div></div>',
			partial: ''
		});

	$locationProvider.html5Mode(true);
});

