'use strict';

angular.module('learningMeanListsApp')
  .controller('ListEditCtrl', function ($scope, $http, $routeParams, Auth, socket) {

    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;


    $scope.isOwner = function () {
      var currentUser = Auth.getCurrentUser();
      if (!currentUser || !$scope.list || !$scope.list.owner)
        return false;

      return $scope.list.owner._id == currentUser._id;
    }

    //initialize the scope
    $scope.list= {};
    $scope.lookupProviders = [];

    $scope.jsonlist = "";

    //get the list of lookup providers
    $http.get('/api/lookup/providers').success(function(lookupProviders) {
      $scope.lookupProviders = lookupProviders;
      //socket.syncUpdates('thing', $scope.awesomeThings);
    });

    //get the list specified by routeParams
    $http.get('/api/lists/'+$routeParams.id).success(function(list) {
      $scope.list = list;

      //for debugging
      $scope.jsonlist = JSON.stringify(list);

      //is this even right?
      socket.syncUpdates('list', $scope.list);
   });

    //add a new list item
    $scope.addListItem = function() {
      //only if not empty
      if($scope.newTerm === '') {
        return;
      }
   
      var list = $scope.list;
      //save the item to the list
      $http.post('/api/lists/'+$scope.list._id+'/items', { term:$scope.newTerm })
      .success(function(item) {

        //and add it to the scope list
        //(is this even necessary? does socket.io magic obviate this?)
        list.items.push(item);
        
        //retrieve the results for this item
        // !!! it is inefficient to wait until the list api has returned to start this lookup
        // !!! to do: use oboe and/or angular-oboe for streaming json requests
        $http.get('/api/lookup/'+item.term)
        .success(function(response) {
          //get all the proper results
          item['results'] = response.results;

          //save them to the database
          $http.put('/api/lists/'+list._id+'/items/'+item._id, item);
        });
      })

      
      $scope.newTerm = '';
    };

    $scope.refreshListItem = function(item) {
      $http.get('/api/lookup/'+item.term)
        .success(function(response) {
          item['results'] = response.results;


          //save them to the database
          $http.put('/api/lists/'+$scope.list._id+'/items/'+item._id, item);
        });
    }

    //delete the list item
    $scope.deleteListItem = function(item) {
      $http.delete('/api/lists/' + $scope.list._id + '/items/' + item._id);

      //(is this even necessary? does socket.io magic obviate this?)
      _.remove($scope.list.items, item);
    };


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('list');
    });
  });
