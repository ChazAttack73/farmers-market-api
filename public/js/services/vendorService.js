"use strict";

angular.module('myApp')
  .service('VendorService', ['$http', function($http){
    this.getVendors = function(){
      return $http.get('http://localhost:3000/vendor');
    };
    this.getOneVendor = function(id){
      return $http.get('http://localhost:3000/vendor/'+id);
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