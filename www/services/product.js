/**
 * Created by kiran on 12/29/15.
 */
app
.service('$productservice',['$http','$rootScope','Upload',function($http,$rootScope,Upload){
  this.getById=function(id){
    return $http.get($rootScope.$domain+'/products/'+id+'/');
  };
  this.getByVendor=function(id){
    return $http.get($rootScope.$domain+'/vendors/'+id+'/products');
  };
  this.create=function(params){
    return $http({
      method:'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url:$rootScope.$domain+'/vendors/'+params.vendorid+'/products/',
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
      url:$rootScope.$domain+'/products/'+params.id+'/',
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

  this.uploadImage=function(product,file){
    return Upload.upload({
      url: $rootScope.$domain+'/products/'+product.id+'/upload/', //webAPI exposed to upload the file
      data:{file:file} //pass file as data, should be user ng-model
    });
  }

  this.inventory={
    'get':function(){
      return $http.get($rootScope.$domain+'/inventory/');
    },
    'getByProduct':function(id){
      return $http.get($rootScope.$domain+'/products/'+id+'/inventory/');
    },
    'getByVendor':function(id){
      return $http.get($rootScope.$domain+'/vendors/'+id+'/inventory/');
    },
    'create':function(params){
      return $http({
        method:'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url:$rootScope.$domain+'/products/'+params.id+'/inventory/',
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
        url:$rootScope.$domain+'/products/'+params.ProductId+'/inventory/'+params.id+'/',
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


.factory('$products',function(){
  this.isFactory=true;
  return {data:{data:[]}};
})
.factory('$product',function(){
  this.isFactory=true;
  return {data:{data:[]}};
});