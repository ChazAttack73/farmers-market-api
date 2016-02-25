"use strict";

angular.module('myApp')
.controller('ProductController', ['$scope', 'ProductService', 'EventService', '$rootScope', 'VendorService', '$location', '$localStorage', '$routeParams', function($scope, ProductService, EventService, $rootScope, VendorService, $location, $localStorage, $routeParams){
  $scope.Vendors = [];
  // $scope.vendor = {
  //   createdBy : $rootScope.creator_user
  // };
  $scope.ProductService = ProductService;
//Is this what Micah is doing????
  // ProductService.getProducts().success(function(data){
  //   $scope.Products = data;
  // });
  $scope.noNewPost = true;
  $scope.errorDiv = true;
  var id = $routeParams.id;

  $scope.clickButt = function () {
      $scope.noNewPost = !$scope.noNewPost;
    };
//This is throwing error because it runs when vendorPrivatePage uses this controller
//but it does not have an id to give it
  // ProductService.getProduct(id).success(function(data){
  //   $scope.Product = data;
  // });

  $scope.postProduct=function(product) {
    if (product === undefined) {
      $scope.noNewPost = false;
      $scope.errorDiv = false;
      return $scope.error = "You left all fields blank.  Please retry."
      }
      if(product.name === undefined ||
        product.price === undefined ||
        product.quantity === undefined ||
        product.description === undefined
      ) {
        $scope.noNewPost = false;
        $scope.errorDiv = false;
        return $scope.error = "Please fill out all required fields";
      } else {
        $scope.noNewPost = true;
        $scope.errorDiv = true;
        $scope.error = null;
        product.VendorId = $rootScope.vendor_user.id;
        ProductService.addProduct(product).then(function(data) {
          $scope.product = null;
      });
      return;
      }
      $scope.noNewPost = false;
      $scope.errorDiv = false;
      return $scope.error = 'Unknown error. Please try again';
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
 }]);