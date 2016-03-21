/**
 * Created by kiran on 12/28/15.
 */
app
  .controller('EmployeeController',['$scope','$state','$mdDialog','$employeeservice','$locationservice','$dataType', '$data',function($scope,$state,$mdDialog,$employeeservice,$locationservice,$dataType,$data) {
    $scope.showNewEmployeeDialog=function(event) {
      $mdDialog.show({
        targetEvent: event,
        scope: $scope,
        preserveScope: true,
        templateUrl: '/www/partials/employee.new.html',
        controller: function ($scope, $mdDialog) {
          $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
          'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
          'WY').split(' ').map(function (state) {
            return {abbrev: state};
          });
          $scope.genders = ('Male,Female').split(',').map(function (gender) {
            return {abbrev: gender};
          });            
          $scope.entity = {
            name: '',
            contactname: '',
            addressline1: '',
            addressline2: '',
            city: '',
            state: '',
            country: 'USA',
            zipcode: '',
            email: '',
            phone: '',
            latitude:0.0,
            longitude:0.0,
            password:'',
            password2:''  
          }
        }
      });
    };
    $scope.save=function(){
      $locationservice
          .find($scope.entity.addressline1+' '+$scope.entity.addressline2,$scope.entity.city,$scope.entity.state)
          .then(function(location){
                $scope.entity.formattedaddress=location.data.results[0].formatted_address;
                var ll=location.data.results[0].address_components.length-1;
                $scope.entity.zipcode=location.data.results[0].address_components[ll].long_name;
          
                $scope.entity.latitude=location.data.results[0].geometry.location.lat;
                $scope.entity.longitude=location.data.results[0].geometry.location.lng;
              $employeeservice.createEmployee($scope.entity).success(function(data){
                if(data.rc>=0){
                  $mdDialog.cancel();
                  $state.go('employee',{employeeid:data.id});
                }
              });
          });    

    };
    $scope.cancel=function(){
      $mdDialog.cancel();
      if($scope.detailineditmode){
        $scope.detailineditmode=false;
        $scope.selectedEmployee={};
      }
    };

    $scope.selectedEmployee={};
    $scope.detailineditmode=false;
    $scope.edit=function(employee){
      $scope.detailineditmode=true;
      $scope.selectedEmployee=angular.copy(employee);
    }

    function getPrimary(_employee) {
      _foundprimary = false;
      _cnt = _employee.EmployeeAddressBooks.length;
        
      for (_i = 0; _i < _cnt && !_foundprimary; _i++) {
        if (_employee.EmployeeAddressBooks[_i].isprimary == 1) {
            _primary = {
              EmployeeId: _employee.id,
              EmployeeAddressBookId: _employee.EmployeeAddressBooks[_i].id,
              addressline1: _employee.EmployeeAddressBooks[_i].addressline1,
              addressline2: _employee.EmployeeAddressBooks[_i].addressline2,
              city: _employee.EmployeeAddressBooks[_i].city,
              country: _employee.EmployeeAddressBooks[_i].country,
              email: _employee.EmployeeAddressBooks[_i].email,
              phone: _employee.EmployeeAddressBooks[_i].phone,
              zipcode: _employee.EmployeeAddressBooks[_i].zipcode,
            };
            _foundprimary = true;
          }
        }
      return _primary;
    };


    if($dataType=='employees'){
      $scope.employees=$data.data.data;
    }

    if($dataType=='employee') {
      _data = $data.data.data;
      _primary = getPrimary(_data);
      $scope.employee = {
        id: _data.id,
        name: _data.name,
        createdAt: _data.createdAt,
        updatedAt: _data.updatedAt,
      };
      $scope.employee.primary = angular.copy(_primary);
    }
  }]);