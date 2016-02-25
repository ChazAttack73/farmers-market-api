angular.module('myApp', ['ngRoute', 'ngStorage', 'angular-stripe']);

var myApp = angular.module('myApp');

var checkedLoggedIn=function($q, $timeout, $http, $location, $rootScope) {
  //initiate a new promise
  var deferred =$q.defer();

  //make and AJAX call to check if the user is logged in
  $http.get('/api/authenticate')
    .success(function(user) {
      // if Authenticated
      if(user !== '0') {
        deferred.resolve();

      //if not Authenticated
      } else if(user === '0') {
        $rootScope.message= 'You need to log in.';
        deferred.reject();
        $location.url('/login');
      }
    });
    return deferred.promise;
};

myApp
.config(['$routeProvider','stripeProvider', function($routeProvider, stripeProvider){
  //config

  stripeProvider.setPublishableKey('pk_test_zjMkVWS57QxqiP9XPIdiy7uF');

  $routeProvider
    .when('/', {
      templateUrl : 'views/landing.html',
      controller : 'EventController'
    })
    .when('/login', {
      templateUrl : 'views/login.html',
      controller : 'VendorController'
    })
    .when('/vendor/private', {
      templateUrl : 'views/vendorPrivatePage.html',
      controller : 'VendorController',
      resolve: {
        loggedin: checkedLoggedIn
      }
    })
    .when('/vendor/view/:id', {
      templateUrl : 'views/vendorView.html',
      controller : 'VendorController'
    })
    .when('/vendor/:param1',{
      templateUrl : 'views/vendorProfile.html',
      controller : 'VendorController'
    })
    .when('/product/view', {
      templateUrl : 'views/productView.html',
      controller : 'ProductController'
    })
    .when('/product/:id', {
      templateUrl : 'views/individualProduct.html',
      controller : 'ProductController'
    })
    .when('/register', {
      templateUrl : 'views/register.html',
      controller : 'EventController'
    });
}])

.run(['$rootScope', '$localStorage', function($rootScope, $localStorage){
  if($localStorage.hasOwnProperty("vendor_user")) {
  }
  //initialize
  //$rootScope.vendor_user = $localStorage.vendor_user || '!loggedin';
}]);