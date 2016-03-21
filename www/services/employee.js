/**
 * Created by kiran on 12/29/15.
 */
app
  .service('$employeeservice',['$http',function($http){
    this.getEmployees=function(){
      return $http.get('http://localhost:3000/employees/');
    };
    this.getEmployee=function(employeeid){
      return $http.get('http://localhost:3000/employees/'+employeeid);
    };
    this.createEmployee=function(formObject){
      return $http({
        method:'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url:'http://localhost:3000/employees/',
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
