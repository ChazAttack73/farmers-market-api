"use strict";

angular.module('myApp')
  .service('VendorService', ['$http', function($http){
    this.getVendors = function(){
      return $http.get('/vendor');
    };
    this.getOneVendor = function(vendorId){
      return $http.get('http://localhost:3000/vendor/'+vendorId);
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