'use strict';

angular.module('learningMeanListsApp')
.controller('ListItemCtrl', function ($scope, $http, $routeParams, socket, Auth) {

    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;

    $scope.isOwner = function () {
      var currentUser = Auth.getCurrentUser();
      if (!currentUser || !$scope.list || !$scope.list.owner)
        return false;

      return $scope.list.owner._id == currentUser._id;
    }
 
    //initialize the scope
    $scope.list = {};
    $scope.item = {};
    $scope.lookupProviders = [];
    $scope.selectedProviders = [];
    $scope.results = {};


    //get the list of lookup providers
    $http.get('/api/lookup/providers').success(function(lookupProviders) {
      $scope.lookupProviders = lookupProviders;
      //socket.syncUpdates('thing', $scope.awesomeThings);
    });

     //get the list specified by routeParams
    $http.get('/api/lists/'+$routeParams.id).success(function(list) {
      $scope.list = list;

      //find the item within that list
      //!!! yeesh, we should query the api for this particular item instead
      $scope.item = _.find(list.items, {'_id': $routeParams.itemid});

      $scope.results = $scope.item.results;

      _.forEach($scope.results, function(result){
        result.selected=true;
      });

      //!!! handle item / list not found exceptions

      //update the providers with the list configuration

      //is this even right?
      socket.syncUpdates('list', $scope.list);
    });

    // helper method to get selected providers
    $scope.selectedProviders = function selectedProviders() {
      return filterFilter($scope.selectedProviders, { selected: true });
    };

    // watch selected providers for changes
    //$scope.$watch('lookupProviders|filter:{selected:true}', function (nv) {
    //    $scope.selectedProviders = nv;
    //});

    $scope.refreshItem = function() {
      //$scope.item['results'] = [];

      var selectedProviders = _.filter($scope.lookupProviders, {'selected':true});

      _.forEach(selectedProviders, function (provider) {
        $http.get('/api/lookup/'+$scope.item.term+'/provider/'+provider.key)
          .success(function(response) {

            //$scope.item['results']=$scope.item['results'].concat(response.results);

            $scope.results = $scope.results.concat(response.results);

            //save them to the database
            //!!! prolly shouldn't do this quite yet!
            //$http.put('/api/lists/'+$scope.list._id+'/items/'+$scope.item._id, $scope.item);
          });
      });
    }

    $scope.selectItem = function (item) {
      item.selected = true;
    }

    $scope.deselectItem = function (item) {
      item.selected = false;
      alert(JSON.stringify(item));
    }
});