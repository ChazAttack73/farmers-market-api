"use strict";

angular.module('myApp')
  .controller('VendorController', ['$scope', 'VendorService', 'ProductService', 'EventService', '$location', '$rootScope', '$localStorage', '$routeParams', '$route', '$window','stripe', '$http', function($scope, VendorService, ProductService, EventService, $location, $rootScope, $localStorage, $routeParams, $route, $window, stripe, $http){
    $scope.vendorPrivate = true;
    $scope.vendorValue = true;
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
        $rootScope.loggedInVendor.user = true;
        $localStorage.loggedInVendor = $rootScope.loggedInVendor;
        $location.url('/');
      }).error(function(error) {
          $scope.error ="Wrong username or password";
      });
    };

    $scope.loginVendor = function(vendorLoginCredentials){
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
      $rootScope.singleVendor = null;
      $scope.vendorValue=false;
      //var param1 = $routeParams.param1;
      VendorService.getOneVendorAndProducts(vendor.id).success(function (vendor){
        $rootScope.singleVendor = vendor;
      });
    };

    $scope.getAllVendsWithProdCat = function(prodName, id) {
      $scope.productValue = false;
      id = $routeParams.id;
      VendorService.getAllVendorsWithProduct(prodName, id).success(function(result){
        $scope.VendorsWithTheProduct = result;
      });
    };

    $scope.getIndividualProduct = function(prodId){
      console.log('getIndividualProduct prodId', prodId);
      $scope.venAndProd = false;
      ProductService.getIndiProduct(prodId).success(function(data){
      console.log(111111, data );
        $scope.Product = data;
      });
    };


    // if($route.current.$$route.originalPath==='/vendor/private') {
    //  $scope.getVendorAndProducts({id: 3});
    // }

    $scope.clickButton = function () {
      $scope.venAndProd = true;
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

      if($scope.requested.quantity>$scope.Product.quantity){
        return $scope.error = "Not enough products in inventory for desired product request";
      }

      if($scope.requested.quantity<1){
        return $scope.error = "quantity must be 1 or higher";
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
          //if (err.type && /^Stripe/.test(err.type)) {
          if (err) {
            //console.log('Stripe error: ', err.message);
            return  $scope.error = "Stripe error: " + err.message;
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
  }]);