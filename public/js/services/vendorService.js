"use strict";

angular.module('myApp')
  .service('VendorService', ['$http', function($http){
    this.getVendors = function(){
      return $http.get('/vendor');
    };
    this.getOneVendor = function(vendorId){
      return $http.get('vendor/'+vendorId);
    };
    this.loginVen = function(vendorLog) {
      return $http.post('vendor/login', vendorLog);
    };
    this.register = function(vendor) {
      return $http.post('/event/', vendor);
    };
    this.regVendor = function(newVendor) {
      console.log('at service for vendor', newVendor);
     return $http.post('vendor/register', newVendor);
    };
    this.logout = function() {
      return $http.post('/logout');
    };
  }]);