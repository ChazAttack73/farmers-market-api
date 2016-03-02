"use strict";

angular.module('myApp')
  .controller('ProductController', ['$scope', 'ProductService', 'EventService', '$rootScope', 'VendorService', '$location', '$localStorage', '$routeParams','stripe', '$http', function($scope, ProductService, EventService, $rootScope, VendorService, $location, $localStorage, $routeParams, stripe, $http) {
    $scope.Products= [];
    $scope.ProductService = ProductService;
    $scope.noNewPost = true;
    $scope.errorDiv = true;
    $scope.noProductEdit = true;
    var id = $routeParams.id;
    $rootScope.loggedInVendor = $localStorage.loggedInVendor;

    //Define Suggestions List
    $rootScope.selectedIndex = -1;

    $scope.getAllProducts = function () {
      ProductService.getProducts().success(function(data){
        $rootScope.productNames = [];
        for(var x=0; x<data.length; x++) {
          $rootScope.productNames.push(data[x].name);
        }

        //Sort Array alphabetically
        $rootScope.productNames.sort();
        $scope.Products = data;
      });
    };

    $rootScope.search = function() {
      $rootScope.suggestions = [];
      var myMaxSuggestionListLength = 0;
      for (var i=0; i<$rootScope.productNames.length; i++) {
        var searchItemsSmallLetters = angular.lowercase($rootScope.productNames[i]);
        var searchTextSmallLetters = angular.lowercase($scope.product.name);
        if ( searchItemsSmallLetters.indexOf(searchTextSmallLetters) !== -1) {
          $rootScope.suggestions.push(searchItemsSmallLetters);
          myMaxSuggestionListLength += 1;
          if (myMaxSuggestionListLength === 5) {
            break;
          }
        }
      }
    };

    //Keep Track Of Search Text Value During The Selection From The Suggestions List
    $rootScope.$watch('selectedIndex',function(val){
      if(val !== -1) {
       $scope.product.name = $rootScope.suggestions[$rootScope.selectedIndex];
     }
    });

      //Text Field Events
      //Function To Call on ng-keydown
    $rootScope.checkKeyDown = function(event){
      if(event.keyCode === 40){//down key, increment selectedIndex
        event.preventDefault();
        if($rootScope.selectedIndex+1 !== $rootScope.suggestions.length){
          $rootScope.selectedIndex++;
        }
      }else if(event.keyCode === 38){ //up key, decrement selectedIndex
        event.preventDefault();
        if($rootScope.selectedIndex-1 !== -1){
          $rootScope.selectedIndex--;
        }
      }else if(event.keyCode === 13){ //enter key, empty suggestions array
        event.preventDefault();
        $rootScope.suggestions = [];
      }
    };

    //Function To Call on ng-keyup
    $scope.checkKeyUp = function(event){
      if(event.keyCode !== 8 || event.keyCode !== 46){//delete or backspace
        if($scope.product.name === ""){
          $rootScope.suggestions = [];
        }
      }
    };
    //======================================

    //List Item Events
    //Function To Call on ng-click
    $rootScope.AssignValueAndHide = function(index){
       $scope.product.name = $rootScope.suggestions[index];
       $rootScope.suggestions=[];
    };
    //======================================

    $scope.clickButt = function () {
      $scope.noNewPost = !$scope.noNewPost;
    };

    $scope.getOneProduct = function(id) {
      ProductService.getProduct(id).success(function(data){
      $scope.Product = data;
      });
    };

    $scope.getIndividualProduct = function(){
      console.log(111111);
      var params = $location.url();
      console.log(params);
      ProductService.getIndiProduct($location.url()).success(function(data){
        $scope.Product = data;
      });
    };

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
          product.VendorId = $rootScope.loggedInVendor.id;
          ProductService.addProduct(product).then(function(data) {
          //$scope.product = null;
          $rootScope.singleVendor.Products.push(data.config.data);
        });
        return;
        }
        $scope.noNewPost = false;
        $scope.errorDiv = false;
        return $scope.error = 'Unknown error. Please try again';
    };

    $scope.handleStripe = function(){
      if($scope.stripe===undefined){
        return $scope.error = "Please fill out all required fields";
      }
      if(!$scope.stripe.number || !$scope.stripe.cvc || !$scope.stripe.exp_month || !$scope.stripe.exp_year){
        return $scope.error = "Missing fields";
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
      var quantity = $scope.requested.quantity;

      if(number && cvc && exp_month && exp_year){
        return stripe.card.createToken($scope.stripe)
        .then(function (response) {
          console.log('token created for card ending in ', response.card.last4);
          var payment = angular.copy($scope.stripe);
          payment.card = void 0;
          payment.token = response.id;
          payment.routeParams = id;
          payment.product = $scope.Product.id;
          payment.productQuantity = quantity;
          payment.amount = $scope.Product.price * quantity;
          payment.user = $rootScope.loggedInVendor; //this is actually a user and not a vendor

          ProductService.chargeProduct(payment);

          $rootScope.card = response.card;

          $scope.Product.quantity--;
          response.quantity = $scope.Product.quantity;
          response.routeParams = parseInt($routeParams.id);

        })
        .then(function (data) {

          console.log('successfully submitted payment for $', data);
          $scope.aloha = false;

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

  $scope.checkout = function(){
    //this will go to User table
      //if($rootScope.loggedInVendor.false){     //this is a user and not a vendor
        //show the card form to make token
      //} else{
        //bring out the div to show if they want to use the same card number
        //a button to confirm payment
        //a button to change payment - pops out another payment form
      //}
  };






    $scope.submitEdit = function(product) {
      console.log('what product are you editing????', product);
      ProductService.editProduct(product, product.id).then(function(data){
        VendorService.getOneVendorAndProducts($rootScope.loggedInVendor.id).success(function (vendor){
          //see if anyway to arrange by id with filter
          $rootScope.singleVendor = vendor;
        });
      });
    };

    $scope.delProduct = function(productID) {
      ProductService.deleteProduct(productID).then(function(data) {
        console.log('ldsjfljsdfljsdf', data);
        VendorService.getOneVendorAndProducts($rootScope.loggedInVendor.id).success(function (vendor){
          //see if anyway to arrange by id with filter
          $rootScope.singleVendor = vendor;
        });
      });
    };
  }
]);
