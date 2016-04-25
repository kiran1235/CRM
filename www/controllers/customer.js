/**
 * Created by kiran on 12/29/15.
 */
app
   .controller('CustomerController',['$scope','$state','$mdDialog','$customerservice','$locationservice','$dataType', '$data',function($scope,$state,$mdDialog,$customerservice,$locationservice,$dataType,$data) {
       
    function getPrimary(_customer) {
       
      _foundprimary = false;
      _cnt = _customer.customerContacts.length;
      for (_i = 0; _i < _cnt && !_foundprimary; _i++) {
        if (_customer.customerContacts[_i].isprimary == 1) {
          _abcnt = _customer.customerContacts[_i].customerContactAddressBooks.length;
          for (_j = 0; _j < _abcnt && !_foundprimary; _j++) {
            if (_customer.customerContacts[_i].customerContactAddressBooks[_j].isprimary == 1) {
              _primary = {
                customerId: _customer.id,
                ContactName:_data.customerContacts[_i].name,
                ContactAddressBookId: _customer.customerContacts[_i].customerContactAddressBooks[_j].id,
                addressline1: _customer.customerContacts[_i].customerContactAddressBooks[_j].addressline1,
                addressline2: _customer.customerContacts[_i].customerContactAddressBooks[_j].addressline2,
                city: _customer.customerContacts[_i].customerContactAddressBooks[_j].city,
                country: _customer.customerContacts[_i].customerContactAddressBooks[_j].country,
                email: _customer.customerContacts[_i].customerContactAddressBooks[_j].email,
                phone: _customer.customerContacts[_i].customerContactAddressBooks[_j].phone,
                zipcode: _customer.customerContacts[_i].customerContactAddressBooks[_j].zipcode,
              };
              _foundprimary = true;
            }
          }
          if (!_foundprimary) {
            _j--;
            _primary = {
              customerId: _customer.id,
              ContactName:_data.customerContacts[_i].name,
              ContactAddressBookId: _customer.customerContacts[_i].customerContactAddressBooks[_j].id,
              addressline1: _customer.customerContacts[_i].customerContactAddressBooks[_j].addressline1,
              addressline2: _customer.customerContacts[_i].customerContactAddressBooks[_j].addressline2,
              city: _customer.customerContacts[_i].customerContactAddressBooks[_j].city,
              country: _customer.customerContacts[_i].customerContactAddressBooks[_j].country,
              email: _customer.customerContacts[_i].customerContactAddressBooks[_j].email,
              phone: _customer.customerContacts[_i].customerContactAddressBooks[_j].phone,
              zipcode: _customer.customerContacts[_i].customerContactAddressBooks[_j].zipcode,
            };
            _foundprimary = true;
          }
        }
      }
      if (!_foundprimary) {
        _j = 0;
        for (_i = 0; _i < _cnt && !_foundprimary; _i++) {
          _abcnt = _data.customerContacts[_i].customerContactAddressBooks.length;
          if (_abcnt > 0) {
            _j = 0;
            _primary = {
              customerId: _data.id,
              ContactName:_data.customerContacts[_i].name,
              ContactAddressBookId: _data.customerContacts[_i].customerContactAddressBooks[_j].id,
              addressline1: _data.customerContacts[_i].customerContactAddressBooks[_j].addressline1,
              addressline2: _data.customerContacts[_i].customerContactAddressBooks[_j].addressline2,
              city: _data.customerContacts[_i].customerContactAddressBooks[_j].city,
              country: _data.customerContacts[_i].customerContactAddressBooks[_j].country,
              email: _data.customerContacts[_i].customerContactAddressBooks[_j].email,
              phone: _data.customerContacts[_i].customerContactAddressBooks[_j].phone,
              zipcode: _data.customerContacts[_i].customerContactAddressBooks[_j].zipcode,
            };
            _foundprimary = true;
          }
        }
      }
      return _primary;
    }


    if($dataType=='customers'){
        $scope.customers=[];
      //$scope.customers=$data.data.data;
      _count=$data.data.data.length;
      for(_c=0;_c<_count;_c++){
        _data=$data.data.data[_c];  
        _cnt=_data.length;  
        _i=0; _j=0; 
        _abcnt = _data.customerContacts[_i].customerContactAddressBooks.length;
        if (_abcnt > 0) {
            _primary = {
              id: _data.id,
              name: _data.name,      
              city: _data.customerContacts[_i].customerContactAddressBooks[_j].city,
              phone: _data.customerContacts[_i].customerContactAddressBooks[_j].phone,
              zipcode: _data.customerContacts[_i].customerContactAddressBooks[_j].zipcode,
            };
        }else{
            _primary = {
              id: _data.id,
              name: _data.name,    
              city: 'n/a',
              phone: 'n/a',
              zipcode: 'n/a',
            };
        }
        $scope.customers.push(_primary);
      }    
        
    }

    if($dataType=='customer') {
      _data = $data.data.data;
      _primary = getPrimary(_data);
      $scope.customer = {
        id: _data.id,
        name: _data.name,
        createdAt: _data.createdAt,
        updatedAt: _data.updatedAt,
      };
      $scope.customer.primary = angular.copy(_primary);
    }
      
}]);