/**
 * Created by kiran on 12/29/15.
 */
app
  .service('CustomerService',['$rootScope','$http',function($rootScope,$http){
    this.getCustomers=function(){
      return $http.get($rootScope.$domain+'/customers');
    }
  }])
