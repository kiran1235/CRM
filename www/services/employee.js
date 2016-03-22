/**
 * Created by kiran on 12/29/15.
 */
app
  .service('$employeeservice',['$rootScope','$http',function($rootScope,$http){
    this.getEmployees=function(){
      return $http.get($rootScope.$domain+'/employees/');
    };
    this.getEmployee=function(employeeid){
      return $http.get($rootScope.$domain+'/employees/'+employeeid);
    };
    this.createEmployee=function(formObject){
      return $http({
        method:'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url:$rootScope.$domain+'/employees/',
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
