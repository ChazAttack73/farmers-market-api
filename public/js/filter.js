"use strict";
//custom filter
angular.module('myApp')
.filter('statusCheckingFilter', ['$routeParams', function($routeParams) {
  var id = $routeParams.id;
  return function(event,id) {
    return event.filter(function(event){
      if (event.id !== id){
        return false;
      } else
      return event.id=== id;
    });
  };
}]);