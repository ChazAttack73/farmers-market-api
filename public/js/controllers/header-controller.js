"use strict";

angular.module('myApp')
.controller('HeaderController', ['$scope', 'VendorService', '$localStorage', '$location', function($scope, VendorService, $localStorage, $location){

$scope.loggedInUser = false;
 $scope.logoutButton = function() {
      VendorService.logoutVen().success(function() {
        $localStorage.$reset();
        $location.url('/');
      });
    };
}]);
