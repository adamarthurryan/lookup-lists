'use strict';

angular.module('learningMeanListsApp')

  .controller('ListIndexCtrl', function ($scope, $http, socket, Auth) {
    //initialize the scope
    $scope.lists= [];

    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;
    

    $http.get('/api/lists').success(function(lists) {
      $scope.lists = lists;
      socket.syncUpdates('list', $scope.lists);

    });

    /*
    $scope.lookupProviders = [];

    //get the list of lookup providers
    $http.get('/api/lookup/providers').success(function(lookupProviders) {
      $scope.lookupProviders = lookupProviders;
      //socket.syncUpdates('thing', $scope.awesomeThings);
    });
    */



    //add a new lookup item
    $scope.createList = function() {
      //only if not empty
      if($scope.newListTitle === '') {
        return;
      }

      //post the list to the server
      $http.post('/api/lists', { title: $scope.newListTitle })
      .success(function(list){
        $scope.lists.push(list);
      });
      $scope.newListTitle = '';
    }

    $scope.editList = function(item) {
      //open view/edit route for this item
      $location.path('./edit/'+item._id);
      //_.remove($scope.lookupItems, item);
    };

    $scope.$on('$destroy', function () {
      //socket.unsyncUpdates('thing');
    });

    $scope.displayListUser = function (list) {
      return list.owner._id +" - " +$scope.user._id;  
      if (list.owner._id == $scope.user._id)
        return '';
      else
        return '('+list.owner.name+')';
    }
  });
