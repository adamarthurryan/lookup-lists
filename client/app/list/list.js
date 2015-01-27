'use strict';

angular.module('learningMeanListsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/lists', {
        templateUrl: 'app/list/index/index.html',
        controller: 'ListIndexCtrl'
      })
      .when('/list/edit/:id', {
        templateUrl: 'app/list/edit/edit.html',
        controller: 'ListEditCtrl'
      });
  });