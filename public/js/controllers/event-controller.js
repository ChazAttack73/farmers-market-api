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
}]);
