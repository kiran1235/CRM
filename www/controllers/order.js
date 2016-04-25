/**
 * Created by kiran on 12/29/15.
 */
app
  .controller('OrderController',['$scope','$state','$orderservice','$dataType', '$data',function($scope,$state,$orderservice,$dataType,$data) {

    $scope.save=function(){
    };   
    
    $scope.cancel=function(){
    };

    if($dataType=='orders'){
      $scope.orders=[];
      _count=$data.data.data.length;
      for(_c=0;_c<_count;_c++){
        _data=$data.data.data[_c];  
        _cnt=_data.length;  
        _i=0; _j=0; 
        _primary = {
          id: _data.id,
          createdAt: _data.createdAt,   
          scheduleAt:_data.scheduleAt,
          updatedAt:_data.updatedAt,
          pickupAt:[],
          deliveryAt:{
            'formattedaddress':_data.CustomerContactAddressBook.formattedaddress,
            'phone':_data.CustomerContactAddressBook.phone,
            'city':_data.CustomerContactAddressBook.city,
            },    
          status:_data.status    
        }
        
        _abcnt = _data.OrderVendors[_i].length;
        if (_abcnt > 0) {
            for(_i=0;_i<_abcnt;_i++){
                _primary.pickupAt.push({
                    'VendorId': _data.OrderVendors[_i].VendorId,
                    'city':_data.OrderVendors[_i].VendorContactAddressBook.city,
                    'phone':_data.OrderVendors[_i].VendorContactAddressBook.phone
                });
            }
            
        }else{
                _primary.pickupAt.push({
                    'VendorId': '0',
                    'city':'n/a',
                    'phone':'n/a'
                });
        }
        $scope.orders.push(_primary);
      }    
        
    }

    if($dataType=='order') {
      _data = $data.data.data;
      $scope.order = _data;
    }
  }]);