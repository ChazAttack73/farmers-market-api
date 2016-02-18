"use strict";

angular.module('myApp')
  .service('VendorService', ['$http', function($http){
    this.getVendors = function(){
      return $http.get('http://localhost:3000/api/vendors');
    };
    this.login = function(vendor) {
      return $http.post('/login', vendor);
    };
    this.register = function(vendor) {
      return $http.post('/register', vendor);
    };
    this.logout = function() {
      return $http.post('/logout');
    };
  }]);