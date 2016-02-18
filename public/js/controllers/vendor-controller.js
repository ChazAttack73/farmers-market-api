"use strict";

angular.module('myApp')
  .controller('VendorController', ['$scope', 'VendorService', '$location', '$rootScope', '$localStorage', function($scope, VendorService, $location, $rootScope, $localStorage){
    $scope.Vendors = [];
    $scope.VendorService = VendorService;
    VendorService.getVendors().success(function(data) {
      $scope.Vendors = data;
    });

    $scope.register = function() {
      if(!$scope.vendor.username && $scope.vendor.first_name && $scope.vendor.last_name && $scope.vendor.password && $scope.vendor.email){
        $scope.error = "Please completely fill out form";
        return false;
      }
      vendorService.register($scope.vendor).success(function(result){
        // $rootScope.creator_vendor = result;
        // $rootScope.vendor_first_name = result.first_name;
        // $rootScope.vendor_last_name = result.last_name;
        // $rootScope.creator_vendor = result;
        // $localStorage.creator_vendor = $rootScope.creator_vendor;
        // $rootScope.vendor_full_name = result.first_name + " " + result.last_name;
        $location.url('/events');
      }).error(function(error){
        $scope.error = "Please try again";
      });
    };

    $scope.login = function(){
      VendorService.login($scope.vendor).success(function(result) {
        // $rootScope.creator_vendor = result;
        // $rootScope.vendor_first_name = result.first_name;
        // $rootScope.vendor_last_name = result.last_name;
        // $rootScope.vendor_full_name = result.first_name + " " + result.last_name;
        // $localStorage.creator_vendor = $rootScope.creator_vendor;
        // $localStorage.vendor_full_name = $rootScope.vendor_full_name;
        $location.url('/events');
      }).error(function(error) {
          $scope.error ="Wrong username or password";
      });
    };


  }]);