"use strict";

angular.module('myApp')
.controller('ProductController', ['$scope', 'ProductService', 'EventService', '$rootScope', 'VendorService', '$location', '$localStorage', '$routeParams', 'Stripe', function($scope, ProductService, EventService, $rootScope, VendorService, $location, $localStorage, $routeParams, Stripe){
  $scope.Vendors = [];
  // $scope.vendor = {
  //   createdBy : $rootScope.creator_user
  // };
  $scope.ProductService = ProductService;

  ProductService.getProducts().success(function(data){
    $scope.Products = data;
  });

  var id = $routeParams.id;

  ProductService.getProduct(id).success(function(data){
    $scope.Product = data;
  });

  $scope.handleStripe = function(){

    if($scope.stripe===undefined){
      return;
    }
    if($scope.Product.quantity<=0){
      return;
    }

    var number = $scope.stripe.number;
    var cvc = $scope.stripe.cvc;
    var exp_month = $scope.stripe.exp_month;
    var exp_year = $scope.stripe.exp_year;

    if(number && cvc && exp_month && exp_year){
      Stripe.card.createToken({
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

          // Stripe.customers.create({
          //   description: 'Customer for test@example.com',
          //   source: response.id // obtained with Stripe.js
          //   }, function(err, customer) {
          //     // asynchronously called
          //   });

          // $scope.Product.quantity--;
          // response.quantity = $scope.Product.quantity;
          // response.routeParams = parseInt($routeParams.id);
          // ProductService.chargeProduct(response).then(function(data){
          //   $location.path('/product/'+response.routeParams);
          // });
        }
      });
    }
  };

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
}]);

