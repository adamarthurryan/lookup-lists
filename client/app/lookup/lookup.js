'use strict';

angular.module('learningMeanListsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/lookup', {
        templateUrl: 'app/lookup/lookup.html',
        controller: 'LookupCtrl'
      });
  });