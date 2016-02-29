"use strict";

angular.module('myApp')
.controller('EventController', ['$scope', '$routeParams', 'EventService', 'ProductService', '$rootScope', 'VendorService', '$location', '$localStorage', function($scope, $routeParams, EventService, $rootScope, ProductService, VendorService, $location, $localStorage){
  $scope.Events = [];
  $scope.EventService = EventService;

  var id = $routeParams.id;

  $scope.getOneEvent = function(eventID) {
    EventService.getOneEvent(id).success(function(data){
    $scope.oneEvent = {};
    $scope.oneEvent.id = data[0].id;
    $scope.oneEvent.name = data[0].name.toUpperCase();
    $scope.oneEvent.days = data[0].days.toUpperCase();
    $scope.oneEvent.time = data[0].time.toUpperCase();
    $scope.oneEvent.address = data[0].address.toUpperCase();
    });
  };

  EventService.getEvents().success(function(data){
    for( var i = 0; i < data.length; i++ ){
      var event = $scope.Events[i] = {};
      event.id = data[i].id;
      event.name = data[i].name.toUpperCase();
      event.days = data[i].days.toUpperCase();
      event.time = data[i].time.toUpperCase();
      event.address = data[i].address.toUpperCase();
    }
  });

  $scope.registerEvent = function(theEvent){
    EventService.addEvent(theEvent)
    .success(function(data){
      $location.url('/');
    });
  };


  $scope.registerUser = function(user){
    if(user===undefined || user === null){
      //EEEEERRRRRRROOOOOOOORRRRRRRRR
      return $location.url('/register');
    }

    if(!user.hasOwnProperty('email') ||
       !user.hasOwnProperty('password') ||
       !user.hasOwnProperty('verifyPassword')){
      return $scope.error = "Please fill out all required fields";
    }

    if(user.password !== user.verifyPassword){
      return $scope.error = "Passwords do not match";
    }

    var new_user = {
      email : user.email,
      password : user.password
    };

    EventService.addUser(new_user)

    .success(function(result){
      $rootScope.user_user = result;
      $location.url('/');
    });

    return;
  };

}]);