
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
    this.getIndiProduct = function(id){
      return $http.get(id+'/product');
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
      return $http.post('http://localhost:3000/stripe/'+product.routeParams, product);
    };

    this.setVendorId = function(result){
      return $http.post('http://localhost:3000/stripe/', result);
    };

  }]);