
"use strict";

angular.module('myApp')
  .service('ProductService', ['$http', function($http){
    this.getProducts = function(){
      return $http.get('http://localhost:3000/product');
    };
    this.getProduct = function(){
    };
    this.addProduct = function(product){
      return $http.post('/vendor/new', product);
    };
    this.editProduct = function(product){
      return $http.put('/edit', product);
    };

    this.deleteProduct = function(product) {
      return $http.delete('/delete/' + product._id);
    };
  }]);