"use strict";

angular.module('myApp')
  .service('VendorService', ['$http', function($http){
    this.getVendors = function(){
      console.log('first should be here!!!');
      return $http.get('/vendors');
    };
    this.getOneVendor = function(id){
      return $http.get('http://localhost:3000/vendor/'+id);
    };
    this.login = function(vendor) {
      return $http.post('/login/vendor', vendor);
    };
    this.register = function(vendor) {
      return $http.post('/register', vendor);
    };
    this.logout = function() {
      return $http.post('/logout');
    };
  }]);