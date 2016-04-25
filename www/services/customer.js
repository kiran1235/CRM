/**
 * Created by kiran on 12/29/15.
 */
app
  .service('CustomerService',['$rootScope','$http',function($rootScope,$http){
    this.get=function(){
      return $http.get($rootScope.$domain+'/customers');
    };
    this.getById=function(customerid){
      return $http.get($rootScope.$domain+'/customers/'+customerid);
    };    
  }])
