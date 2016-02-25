
"use strict";

angular.module('myApp')
  .service('EventService', ['$http', function($http){
    this.getEvents = function(){
      return $http.get('http://localhost:3000/event/');
    };
    this.getOneEvent = function(eventId){
      return $http.get('/event/events/'+eventId);
    };
    this.addEvent = function(event){
      return $http.post('/event', event);
    };
    this.editEvent = function(event){
      return $http.put('/edit', event);
    };

    this.deleteEvent = function(event) {
      return $http.delete('/delete/' + event._id);
    };

    this.addUser = function(user){
      console.log(22222222, user);
      return $http.post('user/', user);
    };
  }]);