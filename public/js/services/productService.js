
"use strict";

angular.module('myApp')
  .service('ProductService', ['$http', function($http){
    this.getProducts = function(){
      return $http.get('/product');
    };
    this.getProduct = function(id){
      return $http.get('/product/'+id);
    };
    this.addProduct = function(product){
      return $http.post('/product/new', product);
    };
    this.editProduct = function(product){
      return $http.put('/edit', product);
    };

    this.deleteProduct = function(product) {
      return $http.delete('/delete/' + product._id);
    };

    this.chargeProduct = function(product){
      console.log(44444444444, product);
      return $http.post('http://localhost:3000/payment/'+product.routeParams, product);
    };

  }]);