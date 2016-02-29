"use strict";

angular.module('myApp')
.controller('HeaderController', ['$scope', 'VendorService', '$localStorage', '$location', '$rootScope', function($scope, VendorService, $localStorage, $location, $rootScope){

 $scope.logoutButton = function() {
      VendorService.logoutVen().success(function() {
        $rootScope.loggedInVendor=null;
        $localStorage.$reset();
        $location.url('/');
      });
    };
}]);