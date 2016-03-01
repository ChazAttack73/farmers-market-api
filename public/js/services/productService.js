
"use strict";

angular.module('myApp')
  .service('ProductService', ['$http', function($http){
    this.getProducts = function(){
      return $http.get('/product/');
    };
    this.getProduct = function(id){
      return $http.get('/product/'+id);
    };
    this.getIndiProduct = function(id){
      console.log(22222222);
      console.log(typeof id);
      return $http.get(id+'/product');
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
      console.log(555555555, product);
      return $http.post('http://localhost:3000/stripe/'+product.routeParams, product);
    };

  }]);