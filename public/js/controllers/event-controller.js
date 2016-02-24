"use strict";

angular.module('myApp')
.controller('EventController', ['$scope', 'EventService', 'ProductService', '$rootScope', 'VendorService', '$location', '$localStorage', function($scope, EventService, $rootScope, ProductService, VendorService, $location, $localStorage){
  $scope.Events = [];
  // $scope.vendor = {
    // createdBy : $rootScope.creator_user
  // };
  $scope.EventService = EventService;

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
    console.log(1111111111111, user);
    if(user===undefined || user === null){
      //EEEEERRRRRRROOOOOOOORRRRRRRRR
      console.log(1.1);
      return $location.url('/register');
    }

    if(!user.hasOwnProperty('email') ||
       !user.hasOwnProperty('password') ||
       !user.hasOwnProperty('verifyPassword')){
      console.log(1.2);
      //EEEEERRRRRRROOOOOOOORRRRRRRRR
      return $location.url('/register');
    }

    if(user.password !== user.verifyPassword){
      //EEEEERRRRRRROOOOOOOORRRRRRRRR
      console.log(1.3);
      return $location.url('/register');
    }

    var new_user = {
      email : user.email,
      password : user.password
    };

    EventService.addUser(new_user)
    .success(function(data){
      $location.url('register');
    });
  };

}]);
