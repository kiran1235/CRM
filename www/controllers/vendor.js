/**
 * Created by kiran on 12/28/15.
 */
app
  .controller('VendorController',['$scope','$state','$mdDialog','$vendorservice','$locationservice','$dataType', '$data',function($scope,$state,$mdDialog,$vendorservice,$locationservice,$dataType,$data) {
    $scope.showNewVendorDialog=function(event) {
      $mdDialog.show({
        targetEvent: event,
        scope: $scope,
        preserveScope: true,
        templateUrl: '/www/partials/vendor.new.html',
        controller: function ($scope, $mdDialog) {
          $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
          'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
          'WY').split(' ').map(function (state) {
            return {abbrev: state};
          });
          $scope.entity = {
            name: 'test angular',
            contactname: 'test angular contact name',
            addressline1: 'sample',
            addressline2: 'suite #1',
            city: 'sample',
            state: 'AL',
            country: 'USA',
            zipcode: '12345',
            email: 'na@default',
            phone: '0000000000',
            latitude:0.0,
            longitude:0.0
          }
        }
      });
    };
   $scope.save=function(){
      $locationservice
          .find($scope.entity.primary.addressline1+' '+$scope.entity.primary.addressline2,$scope.entity.primary.city,$scope.entity.primary.state)
          .then(function(location){
                $scope.entity.primary.formattedaddress=location.data.results[0].formatted_address;
                var ll=location.data.results[0].address_components.length-1;
                $scope.entity.primary.zipcode=location.data.results[0].address_components[ll].long_name;
                $scope.entity.primary.latitude=location.data.results[0].geometry.location.lat;
                $scope.entity.primary.longitude=location.data.results[0].geometry.location.lng;
              $vendorservice.createVendor($scope.entity).success(function(data){
                if(data.rc>=0){
                  $mdDialog.cancel();
                  $state.go('vendor',{vendorid:data.VendorId});
                }
              });
          });    

    };   
//   $scope.save=function(){
//      $locationservice
//          .find($scope.entity.addressline1+' '+$scope.entity.addressline2,$scope.entity.city,$scope.entity.state)
//          .then(function(location){
//                $scope.entity.formattedaddress=location.data.results[0].formatted_address;
//                var ll=location.data.results[0].address_components.length-1;
//                $scope.entity.zipcode=location.data.results[0].address_components[ll].long_name;
//                $scope.entity.latitude=location.data.results[0].geometry.location.lat;
//                $scope.entity.longitude=location.data.results[0].geometry.location.lng;
//              $vendorservice.createVendor($scope.entity).success(function(data){
//                if(data.rc>=0){
//                  $mdDialog.cancel();
//                  $state.go('vendor',{vendorid:data.VendorId});
//                }
//              });
//          });    
//
//    };      
    $scope.cancel=function(){
      $mdDialog.cancel();
      if($scope.detailineditmode){
        $scope.detailineditmode=false;
        $scope.selectedVendor={};
      }
    };

    $scope.selectedVendor={};
    $scope.detailineditmode=false;
    $scope.edit=function(vendor){
      $scope.detailineditmode=true;
      $scope.entity=angular.copy(vendor);
    }

    function getPrimary(_vendor) {
      _foundprimary = false;
      _cnt = _vendor.VendorContacts.length;
      for (_i = 0; _i < _cnt && !_foundprimary; _i++) {
        if (_vendor.VendorContacts[_i].isprimary == 1) {
          _abcnt = _vendor.VendorContacts[_i].VendorContactAddressBooks.length;
          for (_j = 0; _j < _abcnt && !_foundprimary; _j++) {
            if (_vendor.VendorContacts[_i].VendorContactAddressBooks[_j].isprimary == 1) {
              _primary = {
                VendorId: _vendor.id,
                ContactName:_data.VendorContacts[_i].name,
                ContactAddressBookId: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].id,
                addressline1: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].addressline1,
                addressline2: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].addressline2,
                city: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].city,
                country: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].country,
                email: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].email,
                phone: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].phone,
                zipcode: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].zipcode,
              };
              _foundprimary = true;
            }
          }
          if (!_foundprimary) {
            _j--;
            _primary = {
              VendorId: _vendor.id,
              ContactName:_data.VendorContacts[_i].name,
              ContactAddressBookId: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].id,
              addressline1: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].addressline1,
              addressline2: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].addressline2,
              city: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].city,
              country: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].country,
              email: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].email,
              phone: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].phone,
              zipcode: _vendor.VendorContacts[_i].VendorContactAddressBooks[_j].zipcode,
            };
            _foundprimary = true;
          }
        }
      }
      if (!_foundprimary) {
        _j = 0;
        for (_i = 0; _i < _cnt && !_foundprimary; _i++) {
          _abcnt = _data.VendorContacts[_i].VendorContactAddressBooks.length;
          if (_abcnt > 0) {
            _j = 0;
            _primary = {
              VendorId: _data.id,
              ContactName:_data.VendorContacts[_i].name,
              ContactAddressBookId: _data.VendorContacts[_i].VendorContactAddressBooks[_j].id,
              addressline1: _data.VendorContacts[_i].VendorContactAddressBooks[_j].addressline1,
              addressline2: _data.VendorContacts[_i].VendorContactAddressBooks[_j].addressline2,
              city: _data.VendorContacts[_i].VendorContactAddressBooks[_j].city,
              country: _data.VendorContacts[_i].VendorContactAddressBooks[_j].country,
              email: _data.VendorContacts[_i].VendorContactAddressBooks[_j].email,
              phone: _data.VendorContacts[_i].VendorContactAddressBooks[_j].phone,
              zipcode: _data.VendorContacts[_i].VendorContactAddressBooks[_j].zipcode,
            };
            _foundprimary = true;
          }
        }
      }
      return _primary;
    };


    if($dataType=='vendors'){
        $scope.vendors=[];
      //$scope.vendors=$data.data.data;
      _count=$data.data.data.length;
      for(_c=0;_c<_count;_c++){
        _data=$data.data.data[_c];  
        _cnt=_data.length;  
        _i=0; _j=0; 
        _abcnt = _data.VendorContacts[_i].VendorContactAddressBooks.length;
        if (_abcnt > 0) {
            _primary = {
              id: _data.id,
              name: _data.name,      
              city: _data.VendorContacts[_i].VendorContactAddressBooks[_j].city,
              phone: _data.VendorContacts[_i].VendorContactAddressBooks[_j].phone,
              zipcode: _data.VendorContacts[_i].VendorContactAddressBooks[_j].zipcode,
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
        $scope.vendors.push(_primary);
      }    
        
    }

    if($dataType=='vendor') {
      _data = $data.data.data;
      _primary = getPrimary(_data);
      $scope.vendor = {
        id: _data.id,
        name: _data.name,
        createdAt: _data.createdAt,
        updatedAt: _data.updatedAt,
      };
      $scope.vendor.primary = angular.copy(_primary);
    }
  }]);