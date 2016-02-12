app
.service('$locationservice',['$http',function($http){
    this.find=function(street,city,state){
      street = street.split(' ').join('+');    
      return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+street+',+'+city+',+'+state);
    }
}]);