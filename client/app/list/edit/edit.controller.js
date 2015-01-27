'use strict';

angular.module('learningMeanListsApp')
  .controller('ListEditCtrl', function ($scope, $http, $routeParams, socket) {


    //initialize the scope
    $scope.list= {};
    $scope.lookupProviders = [];

    //get the list of lookup providers
    $http.get('/api/lookup/providers').success(function(lookupProviders) {
      $scope.lookupProviders = lookupProviders;
      //socket.syncUpdates('thing', $scope.awesomeThings);
    });

    //get the item specified in the $routeParams of lookup providers
    $http.get('/api/lists/'+$routeParams.id).success(function(list) {
      $scope.list = list;

      //is this even right?
      socket.syncUpdates('list', $scope.list);
   });

    //add a new list item
    $scope.addListItem = function() {
      //only if not empty
      if($scope.newTerm === '') {
        return;
      }
   
      //save the item to the list
      $http.post('/api/lists/'+$scope.list._id+'/items', { term:$scope.newTerm })
      .success(function(item) {

        //and add it to the scope list
        //(is this even necessary? does socket.io magic obviate this?)
        $scope.list.items.push(item);
      })

      //retrieve the results for this item
      // !!! to do: use oboe and/or angular-oboe for streaming json requests
      //$http.get('/api/lookup/'+$scope.newTerm)
      //.success(function(response) {
      //  item['results'] = response.results;
      //});
      
      $scope.newTerm = '';
    };

    //delete the list item
    $scope.deleteListItem = function(item) {
      $http.delete('/api/lists/' + $scope.list._id + '/items/' + $scope.item._id);

      //(is this even necessary? does socket.io magic obviate this?)
      _.remove($scope.list.items, item);
    };


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('list');
    });
  });
