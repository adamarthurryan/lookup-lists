'use strict';

angular.module('learningMeanListsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/list', {
        templateUrl: 'app/lists/index/index.html',
        controller: 'ListIndexCtrl'
      });
      .when('/list/edit/:id', {
        templateUrl: 'app/lists/edit/edit.html',
        controller: 'ListEditCtrl'
      });
  });