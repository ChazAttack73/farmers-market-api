"use strict";

angular.module('myApp')
  .controller('VendorController', ['$scope', 'VendorService', '$location', '$rootScope', '$localStorage', '$routeParams', '$route', function($scope, VendorService, $location, $rootScope, $localStorage, $routeParams, $route){
    $scope.vendorPrivate=true;
    $scope.vendorValue=true;
    $scope.Vendors = [];
    $scope.VendorService = VendorService;

    var id = $routeParams.id;

    VendorService.getVendors(id)
      .success(function(data) {
        $scope.Vendors = data;
    });

    $scope.registerVendor = function() {
      if(!$scope.vendor.name && $scope.vendor.password && $scope.vendor.phone && $scope.vendor.email && $scope.vendor.description) {
        $scope.error = "Please fill out all required fields";
      } else if($scope.vendor.password !== $scope.vendor.verifyPassword) {
        $scope.error = "Passwords do not match";
      } else {
        var newVendor = {
            name : $scope.vendor.name,
            password : $scope.vendor.password,
            phone : $scope.vendor.phone,
            email : $scope.vendor.email,
            website : $scope.vendor.website,
            description : $scope.vendor.description,
            company_pic : $scope.vendor.company_pic
        };
        VendorService.regVendor(newVendor).success(function(result) {
          $rootScope.vendor_user = result;
          $localStorage.vendor_user = $rootScope.vendor_user;
          $location.url('/');
        }).error(function(error) {
          $scope.error = 'Unknow error.  Please try again';
        });
      }
    };

    // $scope.registerUser = function(user) {

    //   if(!user.username && user.password && user.verifyPassword){
    //     $scope.error = "Please completely fill out form";
    //     return false;
    //   }


    //   if(user.password !== user.verifyPassword){
    //     $scope.error = "verify password does not match";
    //     return false;
    //   }

    //   var newUser = {
    //     username : user.username,
    //     password : user.password
    //   };

    //   VendorService.registerUser(newUser).success(function(result){

    //     $location.url('/');
    //   }).error(function(error){
    //     $scope.error = "Please try again";
    //   });
    // };

    $scope.vendor = [];
    $scope.getVendorAndProducts = function(vendor) {
      $scope.vendorValue=false;
      //var param1 = $routeParams.param1;
      VendorService.getOneVendor(vendor.id).success(function (data){
      $scope.vendor = data;
      });
    };

    $scope.loginVendor = function(){
      var vendorLog = {
        name : $scope.vendor.name,
        password : $scope.vendor.password
      };
      console.log('What am I sending to VendorService?', vendorLog);
      VendorService.loginVen(vendorLog).success(function(result) {
        $rootScope.creator_vendor = result;
        $localStorage.creator_vendor = $rootScope.creator_vendor;
        $scope.login_user=true;
        $location.url('/vendor/private');
      }).error(function(error) {
          $scope.error ="Wrong username or password";
      });
    };

    if($route.current.$$route.originalPath==='/vendor/private') {
     $scope.getVendorAndProducts({id: 3});

    }

  }]);