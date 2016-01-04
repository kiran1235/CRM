/**
 * Created by kiran on 12/29/15.
 */
app
.service('$productservice',['$http','$rootScope',function($http,$rootScope){
  this.get=function(){
    return $http.get('http://localhost:3000/products');
  };
  this.create=function(params){
    return $http({
      method:'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url:'http://localhost:3000/product/',
      data:params,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
          str.push("entity["+encodeURIComponent(p) + "]=" + encodeURIComponent(obj[p]));
        return str.join('&');
      },
    });
  };

  this.update=function(params){
    return $http({
      method:'PUT',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url:'http://localhost:3000/product/'+params.id,
      data:params,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
          str.push("entity["+encodeURIComponent(p) + "]=" + encodeURIComponent(obj[p]));
        return str.join('&');
      },
    });
  }

  this.raise=function(event){
    $rootScope.$broadcast(event);
  };


  this.inventory={
    'get':function(){
      return $http.get('http://localhost:3000/inventory/');
    },
    'create':function(params){
      return $http({
        method:'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url:'http://localhost:3000/product/'+params.id+'/inventory/',
        data:params,
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push("entity["+encodeURIComponent(p) + "]=" + encodeURIComponent(obj[p]));
          return str.join('&');
        },
      });
    },
    'update':function(params){
      return $http({
        method:'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url:'http://localhost:3000/product/'+params.id+'/inventory/',
        data:params,
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push("entity["+encodeURIComponent(p) + "]=" + encodeURIComponent(obj[p]));
          return str.join('&');
        },
      });
    }
  }
}])
