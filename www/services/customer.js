/**
 * Created by kiran on 12/29/15.
 */
app
  .service('CustomerService',['$http',function($http){
    this.getCustomers=function(){
      return $http.get('http://localhost:3000/customers');

    }
  }])
