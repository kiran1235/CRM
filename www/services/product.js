/**
 * Created by kiran on 12/29/15.
 */
app
.service('$productservice',['$http','$rootScope','Upload',function($http,$rootScope,Upload){
  this.getById=function(id){
    return $http.get('http://localhost:3000/product/'+id+'/');
  };
  this.create=function(params){
    return $http({
      method:'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url:'http://localhost:3000/vendor/'+params.vendorid+'/products/',
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
      url:'http://localhost:3000/product/'+params.vendor.id+'/',
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
      url: 'http://localhost:3000/product/'+product.id+'/upload/', //webAPI exposed to upload the file
      data:{file:file} //pass file as data, should be user ng-model
    });
  }

  this.inventory={
    'get':function(){
      return $http.get('http://localhost:3000/inventory/');
    },
    'getByProduct':function(id){
      return $http.get('http://localhost:3000/product/'+id+'/inventory/');
    },
    'getByVendor':function(id){
      return $http.get('http://localhost:3000/vendor/'+id+'/inventory/');
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
        url:'http://localhost:3000/product/'+params.id+'/inventory/'+params.inventoryId+'/',
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

app.factory('$products',function(){
  this.isFactory=true;
  return {data:{data:[]}};
});

app.factory('$product',function(){
  this.isFactory=true;
  return {data:{data:[]}};
});