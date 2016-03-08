"use strict";
//Created this controller and all functions below...BB
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
        for(var x = 0; x < data.length; x++) {
          if($rootScope.productNames.indexOf(angular.uppercase(data[x].name)) === -1) {
            $rootScope.productNames.push(angular.uppercase(data[x].name));
          }
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
        var searchItemsCAPLetters = angular.uppercase($rootScope.productNames[i]);
        var searchTextCAPLetters = angular.uppercase($scope.product.name);
        if ( searchItemsCAPLetters.indexOf(searchTextCAPLetters) !== -1) {
          $rootScope.suggestions.push(searchItemsCAPLetters);
          myMaxSuggestionListLength += 1;
          if (myMaxSuggestionListLength === 3) {
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

    // $scope.getOneProduct = function(id) {
    //   ProductService.getProduct(id).success(function(data){
    //   $scope.Product = data;
    //   });
    // };

    $scope.submitEdit = function(product) {
      ProductService.editProduct(product, product.id).then(function(data){
        VendorService.getOneVendorAndProducts($rootScope.loggedInVendor.id).success(function (vendor){
          $rootScope.singleVendor = vendor;
        });
      });
    };

    $scope.delProduct = function(productID) {
      ProductService.deleteProduct(productID).then(function(data) {
        VendorService.getOneVendorAndProducts($rootScope.loggedInVendor.id).success(function (vendor){
          $rootScope.singleVendor = vendor;
        });
      });
    };
  }
]);
