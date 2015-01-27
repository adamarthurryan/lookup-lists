'use strict';

angular.module('learningMeanListsApp')
  .controller('ListCtrl', function ($scope, $http, socket) {
    //initialize the scope
    $scope.lookupItems= [];
    $scope.lookupProviders = [];

    //get the list of lookup providers
    $http.get('/api/lookup/providers').success(function(lookupProviders) {
      $scope.lookupProviders = lookupProviders;
      //socket.syncUpdates('thing', $scope.awesomeThings);
    });

    //add a new lookup item
    $scope.addLookupItem = function() {
      //only if not empty
      if($scope.newTerm === '') {
        return;
      }

      //create a new lookup item for the term
      var item = { term:$scope.newTerm, results: [] }; 
      $scope.lookupItems.push(item);

      //retrieve the results for this item
      // !!! to do: use oboe and/or angular-oboe for streaming json requests
      $http.get('/api/lookup/'+$scope.newTerm/*+'/provider/dbpedia'*/).success(function(response) {
        item['results'] = response.results;
     });
      
      $scope.newTerm = '';
    };


    $scope.deleteLookupItem = function(item) {
      _.remove($scope.lookupItems, item);
    };

    $scope.$on('$destroy', function () {
      //socket.unsyncUpdates('thing');
    });
  });
