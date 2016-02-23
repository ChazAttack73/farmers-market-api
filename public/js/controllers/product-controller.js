"use strict";

angular.module('myApp')
.controller('ProductController', ['$scope', 'ProductService', 'EventService', '$rootScope', 'VendorService', '$location', '$localStorage', function($scope, ProductService, EventService, $rootScope, VendorService, $location, $localStorage){
  $scope.Vendors = [];
  // $scope.vendor = {
  //   createdBy : $rootScope.creator_user
  // };
  $scope.ProductService = ProductService;
  ProductService.getProducts().success(function(data){
    $scope.Products = data;
  });

  $scope.VendorService = VendorService;
  VendorService.getVendors().success(function(data) {
    $scope.Vendors = data;
  });

  $scope.postButton=function(product) {
    ProductService.addProduct(product).then(function(data) {
      $scope.add_product = false;
      $scope.Products.push(data.data);
    });
  };
  $scope.submitEdit = function(product) {
    ProductService.editProduct(product).then(function(data){
      ProductService.getProducts().success(function(data){
        $scope.Products = data;
      });
    });
  };
  $scope.delProduct = function(product) {
    ProductService.deleteProduct(product).then(function(data) {
      ProductService.getProducts().success(function(data){
        $scope.Products = data;
      });
    });
  };

  $scope.logoutButton = function() {
    VendorService.logout().success(function() {
      $localStorage.$reset();
      $location.url('/events');
    });
  };
}]);