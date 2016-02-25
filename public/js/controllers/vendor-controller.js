"use strict";

angular.module('myApp')
  .controller('VendorController', ['$scope', 'VendorService', 'ProductService', 'EventService', '$location', '$rootScope', '$localStorage', '$routeParams', '$route', function($scope, VendorService, ProductService, EventService, $location, $rootScope, $localStorage, $routeParams, $route){
    $scope.vendorPrivate=true;
    $scope.vendorValue=true;
    $scope.Vendors = [];
    $scope.VendorService = VendorService;

    var id = $routeParams.id;

    $scope.loadEvent = function(id) {
      $scope.selectedEvent = [];
      EventService.getOneEvent(id).success(function(data){
        $scope.selectedEvent = data;
      });
    };

    $scope.logoutButton = function() {
      VendorService.logoutVen().success(function() {
        $rootScope.vendor_user=false;
        $localStorage.$reset();
        $location.url('/');
      });
    };

    $scope.getAllVendorsForEvent = function() {
      VendorService.getVendors(id)
      .success(function(data) {
        $scope.Vendors = data;
      });
    };

    $scope.registerVendor = function(vendor) {
      if(!vendor.name && vendor.password && vendor.phone && vendor.email && vendor.description) {
        $scope.error = "Please fill out all required fields";
      } else if(vendor.password !== vendor.verifyPassword) {
          $scope.error = "Passwords do not match";
      } else {
        VendorService.regVendor($scope.vendor).success(function(result) {
          $rootScope.vendor_user = result;
          $localStorage.vendor_user = $rootScope.vendor_user;
          $location.url('/vendor/private');
        }).error(function(error) {
          $scope.error = 'Unknown error.  Please try again';
        });
      }
    };

    $scope.loginUser = function(userLoginCredentials){
      userLoginCredentials.type = 'user';
      EventService.loginUser(userLoginCredentials).success(function(result) {

        $rootScope.user_user = result;
        $location.url('/');
      }).error(function(error) {
          $scope.error ="Wrong username or password";
      });
    };

    $scope.loginVendor = function(vendorLoginCredentials){

      console.log('At vendorservice', vendorLoginCredentials);
      vendorLoginCredentials.type = 'vendor';
      VendorService.loginVen(vendorLoginCredentials).success(function(result) {
        $rootScope.vendor_user = result;
        $localStorage.vendor_user = $rootScope.vendor_user;
        $location.url('/vendor/private');
      }).error(function(error) {
          $scope.error ="Wrong username or password";
      });
    };

    $scope.deleteVendor = function(vendor) {
      VendorService.delVendor(vendor, $rootScope.vendor_user.id).success(function(result) {
        $rootScope.vendor_user=false;
        $localStorage.$reset();
        $location.url('/');
      });
    };

    $scope.getAllProductsForEvent = function() {
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
    //
    //This will run every time controller (or page that uses this controler) is hit.  Do we want this?
    $scope.event = [];
    $scope.getEventProducts = function(event){
      // $scope.productValue = false;
      EventService.getOneEvent(event.id).success(function(data){
        $scope.event = data;
      });
    };

    $scope.editVendor = function(vendor) {
      VendorService.editVendorInfo(vendor, $rootScope.vendor_user.id).success(function(data) {
        $rootScope.vendor_user = data;
        $location.url('/vendor/private');
      });
    };

    $scope.getVendorAndProducts = function(vendor) {
      $scope.vendor = [];
      $scope.vendorValue=false;
      //var param1 = $routeParams.param1;
      VendorService.getOneVendor(vendor.id).success(function (data){
      $scope.vendor = data;
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