/**
 * Created by kiran on 12/29/15.
 */
app
  .service('$vendorservice',['$rootScope','$http',function($rootScope,$http){
    this.getVendors=function(){
      return $http.get($rootScope.$domain+'/vendors');
    };
    this.getVendor=function(vendorid){
      return $http.get($rootScope.$domain+'/vendors/'+vendorid);
    };
    this.createVendor=function(formObject){
      return $http({
        method:'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url:$rootScope.$domain+'/vendors/',
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
