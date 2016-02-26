"use strict";

angular.module('myApp')
.controller('ProductController', ['$scope', 'ProductService', 'EventService', '$rootScope', 'VendorService', '$location', '$localStorage', '$routeParams', 'stripe', '$http', function($scope, ProductService, EventService, $rootScope, VendorService, $location, $localStorage, $routeParams, stripe, $http){
  $scope.Vendors = [];
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
  ProductService.getProduct(id).success(function(data){
    $scope.Product = data;
  });

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
    console.log(111111111111);

    if($scope.stripe===undefined){
      return $scope.error = "Please fill out all required fields";
    }
    if($scope.Product.quantity<=0){
      return $scope.error = "SOLD OUT";
    }
    // a validation to make sure someone is logged in.
    //if(loggin checker thing here, if someone isn't logged in){
    //  return $scope.error = "need to log in"
    //}

    var number = $scope.stripe.number;
    var cvc = $scope.stripe.cvc;
    var exp_month = $scope.stripe.exp_month;
    var exp_year = $scope.stripe.exp_year;

    if(number && cvc && exp_month && exp_year){
      console.log(22222222222);

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
        payment.user = $rootScope.user_user;

        ProductService.chargeProduct(payment);
      })
      .then(function () {

        console.log('successfully submitted payment for $', payment);

        // $scope.Product.quantity--;
        // response.quantity = $scope.Product.quantity;
        // response.routeParams = parseInt($routeParams.id);
        // ProductService.chargeProduct(response).then(function(data){
        //   $location.path('/product/'+response.routeParams);
        // });
      })
      .catch(function (err) {
        if (err.type && /^Stripe/.test(err.type)) {
          console.log('Stripe error: ', err.message);
        }
        else {
          console.log('Other error occurred, possibly with your API', err.message);

          // Stripe.customers.create({
          //   description: 'Customer for test@example.com',
          //   source: response.id // the token
          //   }, function(err, customer) {
          //     // asynchronously called
          //   });

        }
      });
    }
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

