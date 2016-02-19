"use strict";

angular.module('myApp')
.controller('EventController', ['$scope', 'EventService', 'ProductService', '$rootScope', 'VendorService', '$location', '$localStorage', function($scope, EventService, $rootScope, ProductService, VendorService, $location, $localStorage){
  $scope.Events = [];
  // $scope.Events = [{
  //   name : "Manoa Marketplace",
  //   address: "2752 Woodlawn Drive",
  //   days: "Tuesday, Thursday, Sunday",
  //   time: "7:00 AM to 11:00"
  // }];
  $scope.vendor = {
    createdBy : $rootScope.creator_user
  };
  $scope.EventService = EventService;
  EventService.getEvents().success(function(data){
    $scope.Events = data;
  });

  $scope.Vendors = [];
    $scope.VendorService = VendorService;
    VendorService.getVendors().success(function(data) {
      $scope.Vendors = data;
    });
}]);