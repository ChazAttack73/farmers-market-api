
"use strict";

angular.module('myApp')
  .service('ProductService', ['$http', function($http){
    this.getProducts = function(){
      return $http.get('/product/');
    };
    this.getProduct = function(id){
      console.log('peekaboooooo!');
      return $http.get('/product/'+id);
    };
    this.addProduct = function(product){
      return $http.post('/product/new', product);
    };
    this.editProduct = function(product, id){
      return $http.put('/product/edit/' + id, product);
    };

    this.deleteProduct = function(productID) {
      return $http.delete('/product/delete/' + productID);
    };

    this.chargeProduct = function(product){
      console.log(44444444444, product);
      return $http.post('http://localhost:3000/stripe/'+product.routeParams, product);
    };

  }]);