/**
 * Created by kiran on 12/29/15.
 */
app
  .service('$vendorservice',['$http',function($http){
    this.getVendors=function(){
      return $http.get('http://localhost:3000/vendors');
    };
    this.getVendor=function(vendorid){
      return $http.get('http://localhost:3000/vendor/'+vendorid);
    };
    this.createVendor=function(formObject){
      return $http({
        method:'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url:'http://localhost:3000/vendor/',
        data:formObject,
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push("entity["+encodeURIComponent(p) + "]=" + encodeURIComponent(obj[p]));
          return str.join('&');
        },
      });
    }
  }])
