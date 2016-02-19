angular.module('myApp', ['ngRoute', 'ngStorage']);

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
.config(['$routeProvider', function($routeProvider){
  //config

  $routeProvider
    .when('/', {
      templateUrl : 'views/landing.html',
      controller : 'EventController'//,
      // resolve: {
      //   loggedin: checkedLoggedIn
      // }
    })
      .when('/login', {
        templateUrl : 'views/login.html',
        controller : 'VendorController'
      })
      .when('/vendor/view/', {
        templateUrl : 'views/vendorView.html',
        controller : 'VendorController'
      })
      .when('/vendor/private', {
        templateUrl : 'views/vendorPrivatePage.html',
        controller: 'VendorController'
      })
      .when('/vendor/:param1',{
        templateUrl : 'views/vendorProfile.html',
        controller : 'VendorController'
      })
      .when('/register', {
        templateUrl : 'views/register.html',
        controller : 'VendorController'
      });
}])

.run(['$rootScope', '$localStorage', function($rootScope, $localStorage){
  // if($localStorage.hasOwnProperty("creator_user")) {
  // }
  //initialize
  // $rootScope.user_full_name = $localStorage.user_full_name  || '!loggedin';
  // $rootScope.creator_user = $localStorage.creator_user || '!loggedin';
}]);