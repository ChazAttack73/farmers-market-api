"use strict";

angular.module('myApp')
.controller('HeaderController', ['$scope', 'VendorService', '$localStorage', '$location', '$rootScope', function($scope, VendorService, $localStorage, $location, $rootScope){

$rootScope.loggedInVendor = $localStorage.loggedInVendor;

$scope.whosLoggedIn = function() {
    console.log('your hitting this?');
    if($localStorage.loggedInVendor.user) {
      $location.url('/user/private');
    } else if(!$localStorage.loggedInVendor.user) {
      $location.url('/vendor/private');
    }
  };

 $scope.logoutButton = function() {
      VendorService.logoutVen().success(function() {
        $rootScope.loggedInVendor=null;
        $localStorage.$reset();
        $location.url('/');
      });
    };
}]);