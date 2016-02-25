"use strict";

angular.module('myApp')
.controller('EventController', ['$scope', '$routeParams', 'EventService', 'ProductService', '$rootScope', 'VendorService', '$location', '$localStorage', function($scope, $routeParams, EventService, $rootScope, ProductService, VendorService, $location, $localStorage){
  $scope.Events = [];
  // $scope.vendor = {
    // createdBy : $rootScope.creator_user
  // };
  $scope.EventService = EventService;

  var id = $routeParams.id;

  EventService.getOneEvent(id).success(function(data){
    $scope.oneEvent = {};
    $scope.oneEvent.id = data[0].id;
    $scope.oneEvent.name = data[0].name.toUpperCase();
    $scope.oneEvent.days = data[0].days.toUpperCase();
    $scope.oneEvent.time = data[0].time.toUpperCase();
    $scope.oneEvent.address = data[0].address.toUpperCase();
  });

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