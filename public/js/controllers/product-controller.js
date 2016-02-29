"use strict";

angular.module('myApp')
  .controller('ProductController', ['$scope', 'ProductService', 'EventService', '$rootScope', 'VendorService', '$location', '$localStorage', '$routeParams', function($scope, ProductService, EventService, $rootScope, VendorService, $location, $localStorage, $routeParams) {
    $scope.Products= [];
    $scope.ProductService = ProductService;
    $scope.noNewPost = true;
    $scope.errorDiv = true;
    var id = $routeParams.id;

    //Define Suggestions List
    $rootScope.suggestions = [];
    $rootScope.selectedIndex = -1;

  //Is this what Micah is doing????
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
      var myMaxSuggestionListLength = 0;
      console.log('at search function $scope.productNames and myMaxSuggestionListLength', $scope.productNames, myMaxSuggestionListLength);
      for (var i=0; i<$rootScope.productNames.length; i++) {
        var searchItemsSmallLetters = angular.lowercase($rootScope.productNames[i]);
        var searchTextSmallLetters = angular.lowercase($scope.searchText);
        console.log('looking at this', searchItemsSmallLetters.indexOf(searchTextSmallLetters), searchTextSmallLetters);
        if ( searchItemsSmallLetters.indexOf(searchTextSmallLetters) !== -1) {
          $rootScope.suggestions.push(searchItemsSmallLetters);
      console.log('on search function $scope.suggestions', $scope.suggestions);
          myMaxSuggestionListLength += 1;
          if (myMaxSuggestionListLength === 5) {
            console.log('does my myMaxSuggestionListLength go over 5?');
            break;
          }
        }
      }
    };

    //Keep Track Of Search Text Value During The Selection From The Suggestions List
    $rootScope.$watch('selectedIndex',function(val){
      console.log('at $watch looking at selectedIndex value ', val);
      if(val !== -1) {
       $scope.searchText = $rootScope.suggestions[$rootScope.selectedIndex];
     }
    });

      //Text Field Events
      //Function To Call on ng-keydown
    $rootScope.checkKeyDown = function(event){
      if(event.keyCode === 40){//down key, increment selectedIndex
        console.log('did you hit the down key??');
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
        if($scope.searchText === ""){
          $scope.suggestions = [];
        }
      }
    };
  //======================================

    //List Item Events
    //Function To Call on ng-click
    $rootScope.AssignValueAndHide = function(index){
       $scope.searchText = $rootScope.suggestions[index];
       $scope.product.name = $scope.searchText;
      console.log('are you here??? at AssignValueAndHide looking at index and $scope.searchText', index, $scope.searchText);
       $rootScope.suggestions=[];
    };
    //======================================

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
          product.VendorId = $rootScope.loggedInVendor.id;
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

