/**
 * Created by kiran on 12/29/15.
 */
app
  .controller('CustomersController',['$scope','Customers',
    function($scope, Customers) {
      $scope.customerNames=Customers.data.data;
    }])
;