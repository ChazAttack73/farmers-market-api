"use strict";

angular.module('myApp')
.controller('ProductController', ['$scope', 'ProductService', 'EventService', '$rootScope', 'VendorService', '$location', '$localStorage', '$routeParams', 'stripe', '$http', function($scope, ProductService, EventService, $rootScope, VendorService, $location, $localStorage, $routeParams, stripe, $http){
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
      return stripe.card.createToken($scope.stripe)
      .then(function (response) {
        console.log('token created for card ending in ', response.card.last4);






        var payment = angular.copy($scope.stripe);
        payment.card = void 0;
        payment.token = response.id;
        payment.routeParams = id;
        payment.product = $scope.Product.id;
        payment.productQuantity = 1;
        payment.amount = $scope.Product.price;

        ProductService.chargeProduct(payment);
      })
      // .then(function (payment) {
      //   console.log('successfully submitted payment for $', payment.amount);
      // });
      // .catch(function (err) {
      //   if (err.type && /^Stripe/.test(err.type)) {
      //     console.log('Stripe error: ', err.message);
      //   }
      //   else {
      //     console.log('Other error occurred, possibly with your API', err.message);

      //     // Stripe.customers.create({
      //     //   description: 'Customer for test@example.com',
      //     //   source: response.id // the token
      //     //   }, function(err, customer) {
      //     //     // asynchronously called
      //     //   });

      //     // $scope.Product.quantity--;
      //     // response.quantity = $scope.Product.quantity;
      //     // response.routeParams = parseInt($routeParams.id);
      //     // ProductService.chargeProduct(response).then(function(data){
      //     //   $location.path('/product/'+response.routeParams);
      //     // });
      //   }
      // });
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

