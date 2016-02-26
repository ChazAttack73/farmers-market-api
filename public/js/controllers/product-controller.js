"use strict";

angular.module('myApp')
  .controller('ProductController', ['$scope', 'ProductService', 'EventService', '$rootScope', 'VendorService', '$location', '$localStorage', '$routeParams', function($scope, ProductService, EventService, $rootScope, VendorService, $location, $localStorage, $routeParams) {
    $scope.Products= [];
    $scope.ProductService = ProductService;
    $scope.noNewPost = true;
    $scope.errorDiv = true;
    var id = $routeParams.id;

  //Is this what Micah is doing????
    $scope.getAllProducts = function () {
      ProductService.getProducts().success(function(data){
        $scope.Products = data;
        console.log('dataaaaaa',typeof data[0].name, data[0].name);
      });
    };


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

    $scope.handleStripe = function(){

      if($scope.stripe===undefined){
        return;
      }

      var number = $scope.stripe.number;
      var cvc = $scope.stripe.cvc;
      var exp_month = $scope.stripe.exp_month;
      var exp_year = $scope.stripe.exp_year;

      if(number && cvc && exp_month && exp_year){
        Stripe.createToken({
          number: number,
          cvc : cvc,
          exp_month : exp_month,
          exp_year : exp_year
        }, function(status, response){
          if(response.error){
            console.log("error", response.error);
          } else {
            //call my service here
            //put call in the service, to the product
            //http.post('asdkf;dsfl')
            console.log(response);
          }
        });
      }

      console.log($scope.stripe);
      console.log(Stripe.createToken, 'alooooooooha');
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
  }
]);

