'use strict';

angular.module('learningMeanListsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/list/index/index.html',
        controller: 'ListIndexCtrl'
      })
      .when('/edit/:id', {
        templateUrl: 'app/list/edit/edit.html',
        controller: 'ListEditCtrl'
      });
  });