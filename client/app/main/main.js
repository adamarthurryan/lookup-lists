'use strict';

angular.module('learningMeanListsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/old', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });