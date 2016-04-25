app
.service('$orderservice',['$http','$rootScope',function($http,$rootScope){
  this.get=function(id){
    return $http.get($rootScope.$domain+'/orders/');
  };    
  this.getById=function(id){
    return $http.get($rootScope.$domain+'/orders/'+id+'/');
  };
  this.getByVendor=function(id){
    return $http.get($rootScope.$domain+'/vendors/'+id+'/products');
  };

  this.update=function(params){
    return $http({
      method:'PUT',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url:$rootScope.$domain+'/orders/'+params.id+'/',
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

  this.items={
    'get':function(order){
      return $http.get($rootScope.$domain+'/orders/'+order.id);
    },
    'update':function(params){
      return $http({
        method:'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url:$rootScope.$domain+'/orders/'+params.orderid+'/',
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
}]);