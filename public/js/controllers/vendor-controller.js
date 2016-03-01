"use strict";

angular.module('myApp')
  .controller('VendorController', ['$scope', 'VendorService', 'ProductService', 'EventService', '$location', '$rootScope', '$localStorage', '$routeParams', '$route', '$window', function($scope, VendorService, ProductService, EventService, $location, $rootScope, $localStorage, $routeParams, $route, $window){
    $scope.vendorPrivate=true;
    $scope.vendorValue=true;
    $scope.Vendors = [];
    $scope.VendorService = VendorService;
    $rootScope.loggedInVendor = $localStorage.loggedInVendor;

    var id = $routeParams.id;

    $scope.loadEvent = function(id) {
      $scope.selectedEvent = [];
      EventService.getOneEventService(id).success(function(data){
        $scope.selectedEvent = data;
      });
    };

    $scope.getAllVendorsForEvent = function() {
      VendorService.getVendors(id)
      .success(function(data) {
        $scope.Vendors = data;
      });
    };

    $scope.registerVendor = function(vendor) {
      if (vendor === undefined) {
        return $scope.error = "You left all fields blank.  Please retry.";
      }
      if(vendor.name === undefined ||
        vendor.password === undefined ||
        vendor.phone === undefined ||
        vendor.email === undefined ||
        vendor.description === undefined ||
        vendor.EventId === undefined
      ) {
        return $scope.error = "Please fill out all required fields";
      } else if(vendor.password !== vendor.verifyPassword) {
          return $scope.error = "Passwords do not match";
      } else {
        VendorService.regVendor($scope.vendor).success(function(result) {
          $rootScope.loggedInVendor = result;
          $localStorage.loggedInVendor = $rootScope.loggedInVendor;
          $location.url('/vendor/private');
          $window.location.href = ('https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_7ys0ugAueODi8W6rX3rWgIbwLuHANGt8&scope=read_write');
        });
        return;
      }
      return $scope.error = 'Unknown error. Please try again';
    };

    $scope.loginUser = function(userLoginCredentials){

      userLoginCredentials.type = 'user';
      EventService.loginUser(userLoginCredentials).success(function(result) {

        $rootScope.loggedInVendor = result;
        $localStorage.loggedInVendor = $rootScope.loggedInVendor;
        $location.url('/');
      }).error(function(error) {
          $scope.error ="Wrong username or password";
      });
    };

    $scope.loginVendor = function(vendorLoginCredentials){

      console.log('At vendorservice', vendorLoginCredentials);
      vendorLoginCredentials.type = 'vendor';
      VendorService.loginVen(vendorLoginCredentials).success(function(result) {
        $rootScope.loggedInVendor = result;
        $localStorage.loggedInVendor = $rootScope.loggedInVendor;
        $location.url('/vendor/private');
      }).error(function(error) {
          $scope.error ="Wrong username or password";
      });
    };

    $scope.deleteVendor = function(vendor) {
      VendorService.delVendor(vendor, $rootScope.loggedInVendor.id).success(function(result) {
        $rootScope.loggedInVendor=null;
        $localStorage.$reset();
        $location.url('/');
      });
    };

    $scope.getAllProductsForEvent = function() {
      var id = $routeParams.id;
      $scope.productsForEvent=[];
      VendorService.getProductsFromVendorsByEvent(id).success(function (data) {
        $scope.productsForEvent = data;
      });
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

    $scope.editVendor = function(vendor) {
      VendorService.editVendorInfo(vendor, $rootScope.loggedInVendor.id).success(function(data) {
        $rootScope.loggedInVendor = data;
        $localStorage.loggedInVendor = $rootScope.loggedInVendor;
        $location.url('/vendor/private');
      });
    };

    $scope.getVendorAndProducts = function(vendor) {
      $scope.singleVendor = null;
      $scope.vendorValue=false;
      //var param1 = $routeParams.param1;
      VendorService.getOneVendorAndProducts(vendor.id).success(function (vendor){
        $scope.singleVendor = vendor;
      });
    };




    // if($route.current.$$route.originalPath==='/vendor/private') {
    //  $scope.getVendorAndProducts({id: 3});
    // }

    $scope.clickButton = function () {
      $scope.vendorValue=true;
    };

    $scope.postProduct = function(product) {
      if(!product.name && product.price && product.quantity && product.description && product.product_picture) {
        $scope.error = "Please fill out all fields about your product";
      } else {
        ProductService.addProduct($scope.product).success(function(result) {

        }).error(function(error){
          $scope.error = "Unknown error. Please try again.";
        });
      }
    };
  }]);