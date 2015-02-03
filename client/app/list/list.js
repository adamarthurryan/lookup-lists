'use strict';

angular.module('learningMeanListsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/list/index/index.html',
        controller: 'ListIndexCtrl'
      })
      .when('/list/:id', {
        templateUrl: 'app/list/list/list.html',
        controller: 'ListListCtrl'
      })
      .when('/list/:id/item/:itemid', {
        templateUrl: 'app/list/item/item.html',
        controller: 'ListItemCtrl'
      });
  });