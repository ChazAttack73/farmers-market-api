// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


// angular.module('myApp', ['ngRoute', 'ngStorage']);

// var myApp = angular.module('myApp');

// var checkedLoggedIn=function($q, $timeout, $http, $location, $rootScope) {
//   //initiate a new promise
//   var deferred =$q.defer();

//   //make and AJAX call to check if the user is logged in
//   $http.get('/api/authenticate')
//     .success(function(user) {
//       // if Authenticated
//       if(user !== '0') {
//         deferred.resolve();

//       //if not Authenticated
//       } else if(user === '0') {
//         $rootScope.message= 'You need to log in.';
//         deferred.reject();
//         $location.url('/login');
//       }
//     });
//     return deferred.promise;
// };

// myApp
// .config(['$routeProvider', function($routeProvider){
//   //config

//   $routeProvider
//     .when('/', {
//       templateUrl : 'views/landing.html',
//       // controller : 'ProductController',
//       // resolve: {
//       //   loggedin: checkedLoggedIn
//       // }
//     });
// //     .when('/cards', {
// //       templateUrl : 'views/cards.html',
// //       controller : 'CardController',
// //       resolve: {
// //         loggedin: checkedLoggedIn
// //       }
// //     })
// //     .when('/login', {
// //       templateUrl : 'views/login.html',
// //       controller : 'UserController'
// //     })
// //     .when('/register', {
// //       templateUrl : 'views/register.html',
// //       controller : 'UserController'
// //     });
// }])

// .run(['$rootScope', '$localStorage', function($rootScope, $localStorage){
//   // if($localStorage.hasOwnProperty("creator_user")) {
//   // }
//   //initialize
//   // $rootScope.user_full_name = $localStorage.user_full_name  || '!loggedin';
//   // $rootScope.creator_user = $localStorage.creator_user || '!loggedin';
// }]);