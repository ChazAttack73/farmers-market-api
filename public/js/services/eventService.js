
"use strict";

angular.module('myApp')
  .service('EventService', ['$http', function($http){
    this.getEvents = function(){
      return $http.get('http://localhost:3000/event/');
    };
    this.getEvent = function(eventId){
      return $http.get('http://localhost3000/'+eventId);
    };
    this.addEvent = function(event){
      return $http.post('/new', event);
    };
    this.editEvent = function(event){
      return $http.put('/edit', event);
    };

    this.deleteEvent = function(event) {
      return $http.delete('/delete/' + event._id);
    };
  }]);