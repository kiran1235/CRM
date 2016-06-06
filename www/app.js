angular.module('store.services', [])
 .service('$orderType',function(){
        return undefined;
 })
 .service('$orderdata',function(){
        return [];
 })
 .service('$utilityservice',['$rootScope','$http',function($rootScope,$http){
      var self=this;
      this.parseDate=function(inputstring){
            var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
                "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
                "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
            var d = inputstring.match(new RegExp(regexp));
            
            var offset = 0;
            var date = new Date(d[1], 0, 1);

            if (d[3]) { date.setMonth(d[3] - 1); }
            if (d[5]) { date.setDate(d[5]); }
            if (d[7]) { date.setHours(d[7]); }
            if (d[8]) { date.setMinutes(d[8]); }
            if (d[10]) { date.setSeconds(d[10]); }
            if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
            if (d[14]) {
                offset = (Number(d[16]) * 60) + Number(d[17]);
                offset *= ((d[15] == '-') ? 1 : -1);
            }
            var time = (Number(date) + (0 * 60 * 1000));
            date.setTime(Number(time));          
            return date;
      };
      
      this.parseTime=function(inputstring){
        var _date=this.parseDate(inputstring);  
        var hours = _date.getHours();
        var minutes = _date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      };
      
      this.formatDate=function(inputstring){
          var _date=this.parseDate(inputstring);
          return {
              'date': (_date.getMonth() + 1) + '/' + _date.getDate() + '/' +  _date.getFullYear(),
              'time': this.parseTime(inputstring)

          }
      };
      
      
 }])
 .service('$restservice',['$rootScope','$http',function($rootScope,$http){
     var self=this;   
     self.get = function (_endpoint,params){
         return $http({
            method:'GET',
            url:$rootScope.$domain+'/webapp/'+_endpoint,
            params:params
         });
     };
     self.post = function(_endpoint,_formObject){
         return $http({
            method:'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url:$rootScope.$domain+'/webapp/'+_endpoint,
            data:_formObject,
            transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
                str.push("entity["+encodeURIComponent(p) + "]=" + encodeURIComponent(obj[p]));
            return str.join('&');
        }
      });
     }; 
     self.put = function(_endpoint,_formObject){
         return $http({
            method:'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url:$rootScope.$domain+'/webapp/'+_endpoint,
            data:_formObject,
            transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
                str.push("entity["+encodeURIComponent(p) + "]=" + encodeURIComponent(obj[p]));
            return str.join('&');
        }
      });      
     };
 }])
 .factory('$userservice',function($rootScope,$restservice,CacheFactory){
    var self=this;
 
    self.get=function(){
        return self.cache.get('/user');
    };
    self.put=function(id,token,type){
        self.cache.put('/user',{id:id,token:token,usertype:type});
    };
    
    self.remove=function(){
        self.cache.put('/user',{id:undefined,token:undefined,usertype:undefined});
    };
    
    self.login=function(entity){
        return $restservice.post('login',entity);        
    };
    

    
    self.save=function(path,params){
        var u=self.get();
        if(u['id']){
           self.cache.put('user/'+u['id']+'/'+path,params); 
           return true;
        }
        return false;
    };
    
    self.fetch=function(path){
        var u=self.get();
        if(u['id']){
           return self.cache.get('user/'+u['id']+'/'+path); 
        }
        return undefined;
    };
    
    self.getDetails=function(){
        var u=self.fetch('details');
        if(u){
            return u;
        }
        return $restservice.get('user/'+self.get().id,{token:self.get().token});
    };    
    

     if (!CacheFactory.get('userCache')) {
      CacheFactory.createCache('userCache', {
        maxAge: 60 * 60 * 1000,  
        deleteOnExpire: 'aggressive',
        recycleFreq: 100,
        storageMode: 'localStorage',
        onExpire:function(key,value){
            $rootScope.$broadcast("$UserExpired");
        }
      });
      self.cache = CacheFactory.get('userCache');
      var _usr=self.cache.get('/user');
      if(!_usr){
         self.cache.put('/user',{id:undefined,token:undefined,usertype:undefined}); 
      }
    }     
    
    return self;
 })
.factory('sessionInjector', ['$rootScope', function($rootScope) {  
    var sessionInjector = {
        request: function(config) {
            if ($rootScope.token) {
                config.headers['x-session-token'] = $rootScope.token;
            }
            return config;
        }
    };
    return sessionInjector;
}]) 
 .service('$locationservice',['$http',function($http){
    this.find=function(street,city,state){
      street = street.split(' ').join('+');    
      return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+street+',+'+city+',+'+state);
    };
 }])
 .service('$vendorservice',['$restservice',function($restservice){
    this.get=function(){
      return $restservice.get('vendors');
    };
    this.getById=function(vendorid){
      return $restservice.get('vendors/'+vendorid);
    };
    this.create=function(formObject){
      return $restservice.post('vendors');  
    };
  }])
 .service('$customerservice',['$restservice',function($restservice){
    this.get=function(){
      return $restservice.get('customers');
    };
    this.getById=function(customerid){
      return $restservice.get('customers/'+customerid);
    };
    this.create=function(formObject){
      return $restservice.post('customers');  
    };
  }])  
 .service('$employeeservice',['$restservice',function($restservice){
    this.get=function(){
      return $restservice.get('employees');
    };
    this.getById=function(employeeid){
      return $restservice.get('employees/'+employeeid);
    };
    this.create=function(formObject){
      return $restservice.post('employees',formObject); 
    };
  }])
  .service('$orderservice',['$restservice',function($restservice){
  this.get=function(){
    return $restservice.get('orders/');
  };    
  this.getById=function(id){
    return $restservice.get('orders/'+id+'/');
  };
  this.getByVendor=function(id){
    return $restservice.get('orders/vendors/'+id+'/');
  };
  this.getByCustomer=function(id){
    return $restservice.get('orders/customers/'+id+'/');
  };
  this.getByEmployee=function(id){
    return $restservice.get('orders/employees/'+id+'/');
  };

  this.update=function(params){
      return $restservice.put('orders/'+params.id+'/',params);
  };

  this.confirm=function(params){
      return $restservice.put('orders/'+params.id+'/confirm',{});
  };
  this.items={
    'get':function(order){
      return $restservice.get('orders/'+order.id);
    },
    'update':function(params){
      return $restservice.put('orders/'+params.orderid+'/');  
    }
  };
}])
.service('$productservice',['$restservice','$rootScope','Upload',function($restservice,$rootScope,Upload){
  this.get=function(id){
    return $restservice.get('products/');
  };
        
  this.getById=function(id){
    return $restservice.get('products/'+id+'/');
  };
  this.getByVendor=function(id){
    return $restservice.get('vendors/'+id+'/products');
  };
  this.create=function(params){
    return $restservice.post('vendors/'+params.vendorid+'/products/',params); 
  };

  this.update=function(params){
    return $restservice.put('products/'+params.id,params); 
  };
  
  this.raise=function(event){
    $rootScope.$broadcast(event);
  };

  this.uploadImage=function(product,file){
    return Upload.upload({
      url: $rootScope.$domain+'/products/'+product.id+'/upload/', //webAPI exposed to upload the file
      data:{file:file} //pass file as data, should be user ng-model
    });
  }

  this.inventory={
    'get':function(){
      return $restservice.get('inventory/');
    },
    'getByProduct':function(id){
      return $restservice.get('products/'+id+'/inventory/');
    },
    'getByVendor':function(id){
      return $restservice.get('vendors/'+id+'/inventory/');
    },
    'create':function(params){
      return $restservice.post('products/'+params.id+'/inventory/',params);  
    },
    'update':function(params){
      return $restservice.put('products/'+params.ProductId+'/inventory/'+params.id+'/',params);  
    }
  };
}])
;

angular.module('store.controllers', [])
.controller('CustomerController',['$scope','$state','$mdDialog','$customerservice','$userservice','$locationservice','$dataType', '$customerdata',function($scope,$state,$mdDialog,$customerservice,$userservice,$locationservice,$dataType,$customerdata) {
    $scope.user=$userservice.get();

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
                ContactName:_customer.customerContacts[_i].name,
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
              ContactName:_customer.customerContacts[_i].name,
              ContactAddressBookId: _customer.customerContacts[_i].customerContactAddressBooks[_j].id,
              addressline1: _customer.customerContacts[_i].customerContactAddressBooks[_j].addressline1,
              addressline2: _customer.customerContacts[_i].customerContactAddressBooks[_j].addressline2,
              city: _customer.customerContacts[_i].customerContactAddressBooks[_j].city,
              country: _customer.customerContacts[_i].customerContactAddressBooks[_j].country,
              email: _customer.customerContacts[_i].customerContactAddressBooks[_j].email,
              phone: _customer.customerContacts[_i].customerContactAddressBooks[_j].phone,
              zipcode: _customer.customerContacts[_i].customerContactAddressBooks[_j].zipcode
            };
            _foundprimary = true;
          }
        }
      }
      if (!_foundprimary) {
        _j = 0;
        for (_i = 0; _i < _cnt && !_foundprimary; _i++) {
          _abcnt = _customer.customerContacts[_i].customerContactAddressBooks.length;
          if (_abcnt > 0) {
            _j = 0;
            _primary = {
              customerId: _customer.id,
              ContactName:_customer.customerContacts[_i].name,
              ContactAddressBookId: _customer.customerContacts[_i].customerContactAddressBooks[_j].id,
              addressline1: _customer.customerContacts[_i].customerContactAddressBooks[_j].addressline1,
              addressline2: _customer.customerContacts[_i].customerContactAddressBooks[_j].addressline2,
              city: _customer.customerContacts[_i].customerContactAddressBooks[_j].city,
              country: _customer.customerContacts[_i].customerContactAddressBooks[_j].country,
              email: _customer.customerContacts[_i].customerContactAddressBooks[_j].email,
              phone: _customer.customerContacts[_i].customerContactAddressBooks[_j].phone,
              zipcode: _customer.customerContacts[_i].customerContactAddressBooks[_j].zipcode
            };
            _foundprimary = true;
          }
        }
      }
      return _primary;
    }


    if($dataType=='customers'){
        $scope.customers=[];
      _count=$customerdata.data.data.length;
      for(_c=0;_c<_count;_c++){
        _data=$customerdata.data.data[_c];  
        _cnt=_data.length;  
        _i=0; _j=0; 
        _primary = {
          id: _data.id,
          name: _data.name, 
          address:'n/a',
          city: 'n/a',
          phone: 'n/a',
          zipcode: 'n/a',
        };
        if(_data.CustomerContacts && _data.CustomerContacts.length>0){
            _abcnt = _data.CustomerContacts[_i].CustomerContactAddressBooks.length;
            if (_abcnt > 0) {
                _primary.address=_data.CustomerContacts[_i].CustomerContactAddressBooks[_j].formattedaddress;
                _primary.city=_data.CustomerContacts[_i].CustomerContactAddressBooks[_j].city;
                _primary.phone=_data.CustomerContacts[_i].CustomerContactAddressBooks[_j].phone;
                _primary.zipcode=_data.CustomerContacts[_i].CustomerContactAddressBooks[_j].zipcode;
            }
        }
        $scope.customers.push(_primary);

      }    
    }

    if($dataType=='customer') {
      _data = $customerdata.data.data;
      _primary = getPrimary(_data);
      $scope.customer = {
        id: _data.id,
        name: _data.name,
        createdAt: _data.createdAt,
        updatedAt: _data.updatedAt,
      };
      $scope.customer.primary = angular.copy(_primary);
    }
      
}])
.controller('EmployeeController',['$scope','$state','$mdDialog','$employeeservice','$userservice','$locationservice','$dataType', '$employeedata',function($scope,$state,$mdDialog,$employeeservice,$userservice,$locationservice,$dataType,$employeedata) {
  $scope.user=$userservice.get();
    
  $scope.showNewEmployeeDialog=function(event) {
    $mdDialog.show({
      targetEvent: event,
      scope: $scope,
      preserveScope: true,
      clickOutsideToClose:true,
      templateUrl: '/www/views/'+$scope.user['usertype']+'/employee.new.html',
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
                $state.go('app.user.employee',{employeeid:data.id});
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
    _i=0;
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
    return _primary;
  };


  if($dataType=='employees'){
    var _employees=[];
    var _ec=$employeedata.data.data.length;
    for(var _e=0; _e<_ec;_e++){
        _employee=$employeedata.data.data[_e];
        _cnt = _employee.EmployeeAddressBooks.length;
        _i=0;
        _primary = {
          id: _employee.id,
          name:_employee.name,
          EmployeeAddressBookId: _employee.EmployeeAddressBooks[_i].id,
          address:_employee.EmployeeAddressBooks[_i].formattedaddress,
          city: _employee.EmployeeAddressBooks[_i].city,
          phone: _employee.EmployeeAddressBooks[_i].phone
        };
        _employees.push(_primary);
    }
    $scope.employees=_employees;
  }

  if($dataType=='employee') {
    _data = $employeedata.data.data;
    _primary = getPrimary(_data);
    $scope.employee = {
      id: _data.id,
      name: _data.name,
      createdAt: _data.createdAt,
      updatedAt: _data.updatedAt,
    };
    $scope.employee.primary = angular.copy(_primary);
  }
}])
.controller('InventoryController',['$scope','$state','$mdDialog','$productservice','$products',function($scope,$state,$mdDialog,$productservice,$products){

  $scope.isvendor=false;

  function getProducts(products){
    _product=[];
    _datalength=products.data.length;
    for(n=0;n<_datalength;n++){
      _data=products.data[n];
      if(_data.Inventories.length<=0){
        _product.push({
          id:_data.id,
          name:_data.name,
          inventoryId:false,
            vendor:{
                id:_data.Vendors[0].id,
                name:_data.Vendors[0].name 
            }
        });
      }else{
        for(iv=0;iv<_data.Inventories.length;iv++){
          _product.push({
            id:_data.id,
            name:_data.name,
            inventoryId:_data.Inventories[iv].id,
            serialnumber:_data.Inventories[iv].serialnumber,
            unitprice:_data.Inventories[iv].unitprice,
            instock:_data.Inventories[iv].instock,
            restock:_data.Inventories[iv].restock,
            vendor:{
                id:_data.Vendors[0].id,
                name:_data.Vendors[0].name 
            }
          });
        }
      }
    }

    return _product;
  }

  $scope.$watch("$scope.currentVendor",function(){
    $scope.initByVendor($scope.currentVendor);
  });

  $scope.initByVendor=function(vendor){
    if(vendor!=undefined){
      $scope.isvendor=true;
      $productservice.inventory.getByVendor(vendor.id).success(function(data){
        $scope.products=getProducts(data);
      });
    }
  };

  $scope.products=getProducts($products.data);

  $scope.selected = {};
  $scope.query = {
    order: 'id',
    limit: 5,
    page: 1
  };

  $scope.$on('onProductUpdated',function(){
    $productservice.getProducts().success(function(data){
      $scope.products=data;
    });
  });

  $scope.getTemplate=function(product){
    if(product.id==$scope.selected.id){
      return 'edit_product_row';
    }else{
      return 'display_product_row';
    }
  }

  $scope.edit=function(product){
    $scope.selected = angular.copy(product);
  }

  $scope.cancel=function(){
    $scope.selected = {};
  }

  $scope.update=function(product){
    $productservice.inventory.update(product).success(function(data){
      if(data.rc>=0){
        angular.forEach($scope.products,function(product,key){
          if(product.id==$scope.selected.id){
            $scope.products[key]=angular.copy($scope.selected);
          }
        });
        $scope.cancel();
      }
    });
  }

  $scope.addInventory=function(product){
    $productservice.inventory.create(product).success(function(data){
      if(data.rc>=0){
        angular.forEach($scope.products,function(product,key){
          if(product.id==$scope.selected.id){
            $scope.products[key]=angular.copy($scope.selected);
          }
        });
        $scope.cancel();
      }
    });
  }

  $scope.showNewForm=function(event){
    $mdDialog.show({
      targetEvent: event,
      scope: $scope,
      preserveScope: true,
      clickOutsideToClose:true,
      templateUrl: '/www/views/'+$scope.user['usertype']+'/newproduct.html',
      controller: function($scope,$mdDialog) {
          $scope.entity={
            name:'test product',
            type:'test type',
            model:'test model',
            category:'test category',
            subcategory:'test sub category',
            serialnumber:'0000000000',
            vendorid:$scope.currentVendor.id,
            vendorname:$scope.currentVendor.name
          }
          $scope.save=function(){
            $productservice.create($scope.entity).success(function(data){
              if(data.rc>=0){
                $mdDialog.cancel();
              }
            });
          };
          $scope.cancel=function(){
            $mdDialog.cancel();

          };
        }
    });
  };
}])
.controller('OrderController',['$scope','$state','$mdDialog','$orderservice','$userservice','$utilityservice','$orderType', '$orderdata',function($scope,$state,$mdDialog,$orderservice,$userservice,$utilityservice,$orderType,$orderdata) {
  $scope.user=$userservice.get();

  $scope.save=function(){
  };   

  $scope.cancel=function(){
  };
  
  $scope.go=function(order){
      $state.go('app.user.order',{usertype:($scope.user.usertype),userid:$scope.user.id,orderid:order.id});
  };
  
  $scope.selectedorder=undefined;
  
  $scope.confirm=function(order){
      $scope.selectedorder=order;
      $orderservice.confirm(order).then(function(response){
          if(response.data.rc==0){
              $scope.selectedorder.status=response.data.data;
              $scope.selectedorder.isstatusupdate=false;
          }
      }).catch(function(error){
         console.log(error); 
      });
  }

  
  if($orderType=='orders'){
    $scope.orders=[];
    _count=$orderdata.data.data.length;
    for(_c=0;_c<_count;_c++){
      _data=$orderdata.data.data[_c];  
      _cnt=_data.length;  
      _i=0; _j=0; 
      
        _da=$utilityservice.formatDate(_data.deliveryAt);
        _sa=$utilityservice.formatDate(_data.scheduleAt);
      
        _primary = {
          id: _data.id,
          createdAt: _data.createdAt,   
          scheduleAt:_sa.date+' '+_sa.time,
          updatedAt:_data.updatedAt,
          pickupAt:[],
          deliveryAt:{
            'formattedaddress':'Not Assigned',
            'phone':'Not Assigned',
            'city':'Not Assigned',
            },
          deliveryDate:_da.date+' '+_da.time, 
          status:_data.status,
          isstatusupdate:false,
          employee:{name:'Not Assigned',id:0}  
        };
        
        if(_data.CustomerContactAddressBook){
            _primary.deliveryAddress={
                'formattedaddress':_data.CustomerContactAddressBook.formattedaddress,
                'phone':_data.CustomerContactAddressBook.phone,
                'city':_data.CustomerContactAddressBook.city,
            };
        };
        


      _abcnt=0;

      if(_data.OrderVendors.length>=0){
          _abcnt = _data.OrderVendors.length;
      }

      if (_abcnt > 0 && $scope.user.usertype=="vendor") {
          for(_i=0;_i<_abcnt;_i++){
              if(_data.OrderVendors[_i].status=="new"){
                _primary.isstatusupdate=true;
              }              
           _primary.status=_data.OrderVendors[_i].status;
          }

      }else{
              _primary.pickupAt.push({
                  'VendorId': '0',
                  'city':'n/a',
                  'phone':'n/a'
              });
      }

      if(_data.Employee != undefined){
          _primary.employee.name = _data.Employee.name;
          _primary.employee.id = _data.EmployeeId;
      }          
      $scope.orders.push(_primary);
    }    

  }

  if($orderType=='order') {
    _data = $orderdata.data.data;
    $scope.order = _data;
  }

  if($orderType=='vendor'){
    $scope.orders=[];
    _count=$orderdata.data.data.length;
    for(_c=0;_c<_count;_c++){
      _data=$orderdata.data.data[_c];  
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
  };  
  
  
  
    $scope.showOrderByCustomers=function(id){
        $mdDialog.show({
          scope: $scope,
          preserveScope: true,
          templateUrl: '/www/views/modals/orders.dialog.html',
          clickOutsideToClose:true,
          controller:function($scope,$utilityservice){
              $scope.orders=[]
              $scope.customerId=id;
              $scope.init=function(){
                  $orderservice.getByCustomer($scope.customerId).then(function(response){
                    _data=response.data.data;  
                    _dc=_data.length;
                    for(_d=0;_d<_dc;_d++){
                        _da=$utilityservice.formatDate(_data[_d].deliveryAt);
                        _sa=$utilityservice.formatDate(_data[_d].scheduleAt);
                        $scope.orders.push({
                            id:_data[_d].id,
                            scheduleAt:_sa,
                            deliveryDate:_da,
                            employee:_data[_d].Employee
                        })
                    }
                  }).catch(function(err){
                      
                  });
              };
          }
        });
        return false;
    };
    
    $scope.showOrderByVendors=function(id){
        $mdDialog.show({
          scope: $scope,
          preserveScope: true,
          templateUrl: '/www/views/modals/orders.dialog.html',
          clickOutsideToClose:true,
          controller:function($scope,$utilityservice){
              $scope.orders=[]
              $scope.vendorid=id;
              $scope.init=function(){
                  $orderservice.getByVendor($scope.vendorid).then(function(response){
                    _data=response.data.data;  
                    _dc=_data.length;
                    for(_d=0;_d<_dc;_d++){
                        _da=$utilityservice.formatDate(_data[_d].deliveryAt);
                        _sa=$utilityservice.formatDate(_data[_d].scheduleAt);
                        $scope.orders.push({
                            id:_data[_d].id,
                            scheduleAt:_sa,
                            deliveryDate:_da,
                            employee:_data[_d].Employee
                        })
                    }
                  }).catch(function(err){
                      
                  });
              };
          }
        });
        return false;
    };    
  
    $scope.showOrderByEmployees=function(id){
        $mdDialog.show({
          scope: $scope,
          preserveScope: true,
          templateUrl: '/www/views/modals/orders.dialog.html',
          clickOutsideToClose:true,
          controller:function($scope,$utilityservice){
              $scope.orders=[]
              $scope.employeeId=id;
              $scope.init=function(){
                  $orderservice.getByEmployee($scope.employeeId).then(function(response){
                    _data=response.data.data;  
                    _dc=_data.length;
                    for(_d=0;_d<_dc;_d++){
                        _da=$utilityservice.formatDate(_data[_d].deliveryAt);
                        _sa=$utilityservice.formatDate(_data[_d].scheduleAt);
                        $scope.orders.push({
                            id:_data[_d].id,
                            scheduleAt:_sa,
                            deliveryDate:_da,
                            employee:_data[_d].Employee
                        })
                    }
                  }).catch(function(err){
                      
                  });
              };
          }
        });
        return false;
    };   
  
}])
.controller('VendorProductController',['$scope','$state','$mdDialog','$productservice',function($scope,$state,$mdDialog,$productservice){
  $scope.showNewForm=function(event){
    $mdDialog.show({
      targetEvent: event,
      scope: $scope,
      preserveScope: true,
      clickOutsideToClose:true,
      templateUrl: '/www/views/'+$scope.user['usertype']+'/newproduct.html',
      controller: function($scope,$mdDialog) {
          $scope.entity={
            name:'test product',
            type:'test type',
            model:'lb',
            category:'test category',
            subcategory:'test sub category',
            serialnumber:'0000000000',
            vendorid:$scope.currentVendor.id,
            vendorname:$scope.currentVendor.name
          }
          $scope.save=function(){
            $productservice.create($scope.entity).success(function(response){
              if(response.rc>=0){
                  console.log(response);
                $scope.products.push(response.data);
                  console.log($scope.products);
                $mdDialog.cancel();
              }
            });
          };
          $scope.cancel=function(){
            $mdDialog.cancel();
          };
        }
    });
  };
}])
.controller('ProductController',['$scope','$state','$mdDialog','$userservice','$productservice','$productType','$productdata',function($scope,$state,$mdDialog,$userservice,$productservice,$productType,$productdata){
  $scope.user=$userservice.get();
  $scope.detailineditmode=false;
  $scope.selectedInventory = {};
  $scope.selectedProduct = {};
  $scope.isImageEditMode=false;
  $scope.isImageUpdated=false;
  var _inventories=[];
  var _data=$productdata.data.data;
  var _datalength=$productdata.data.data.length;
  var _product=_data;
  if($productType=="product"){
    for(var key in _data){
      if(!Array.isArray(_data[key])){
        _product[key]=_data[key];
      }
    }
  }
  if(_data.Inventories){
    for(var iv=0;iv<_data.Inventories.length;iv++){
      var _upd=_data.Inventories[iv].updatedAt.slice(0,10);
      _data.Inventories[iv].updatedAt=_upd;
      _data.Inventories[iv].ProductId=_product.id;
      _inventories.push(_data.Inventories[iv]);
    }
    
  }
  
  if(_data['ProductImages']==undefined || _data['ProductImages'].length<=0){
    _product['image']='/www/assets/images/noimage.png';
  }else{
    _product['image']='/tmp/uploads/'+_data['ProductImages'][0]['filename'];
  }
  var _vendor={id:0,name:'unknown'};

  if(_data.Vendors && _data.Vendors.length>0){
      _vendor={
          id:_data.Vendors[0].id,
          name:_data.Vendors[0].name
     }   
  }  

  $scope.vendor=_vendor;   

  $scope.products=_product;
  if($productType=="product"){
      $scope.product=_product;
  }  

  $scope.inventories=_inventories;
  $scope.edit=function(product){
    $scope.detailineditmode=true;
    $scope.selectedProduct = angular.copy(product);
  }

  $scope.cancel=function(){
    $scope.detailineditmode=false;
    $scope.selectedProduct = {};
  }

  $scope.save=function(product){
    $productservice.update(product).success(function(data){
      if(data.rc>=0){
        $scope.product=$scope.selectedProduct;
        $scope.cancel();
      }
    });
  }

  $scope.update=function(product){
    $productservice.inventory.create(inventory).success(function(data){
      if(data.rc>=0){
        angular.forEach($scope.inventories,function(inventory,key){
          if(inventory.id==$scope.selectedInventory.id){
            $scope.inventories[key]=angular.copy($scope.selectedInventory);
          }
        });
        $scope.detailineditmode=false;
      }
    });
  }

  /**** Inventory Control ****/


  $scope.getTemplate=function(inventory){
    if(inventory.id==$scope.selectedInventory.id){
      return 'edit_product_row';
    }else{
      return 'display_product_row';
    }
  }

  $scope.newInventory=function($event){
      $scope.newinventory={
        id:$scope.product.id,
        ProductId:$scope.product.id,
        instock:0,
        restock:0,
        unitprice:0.00,
        serialnumber:'',
      };
    $mdDialog.show({
      targetEvent:$event,
      scope:$scope,
      preserveScope: true,
      templateUrl: 'new_inventory_dialog',
    });
  };

  $scope.cancelNewInventory=function(){
    $mdDialog.cancel();
  };

  $scope.addInventory=function(){
      $productservice.inventory.create($scope.newinventory).success(function(data){
        if(data.rc>=0){
          _data=data.data;
          _cr=_data.createdAt.slice(0,10);
          _upd=_data.updatedAt.slice(0,10);
          _data.createdAt=_cr;
          _data.updatedAt=_upd;
          $scope.inventories.push(_data);
          $scope.cancelNewInventory();
        }
      });
  };

  $scope.editInventory=function(inventory){
    $scope.selectedInventory = angular.copy(inventory);
  }

  $scope.cancelEditInventory=function(){
    $scope.selectedInventory = {};
  }

  $scope.updateInventory=function(inventory){
    $productservice.inventory.update(inventory).success(function(data){
      if(data.rc>=0){
        angular.forEach($scope.inventories,function(inventory,key){
          if(inventory.id==$scope.selectedInventory.id){
            $scope.inventories[key]=angular.copy($scope.selectedInventory);
            $scope.cancelEditInventory();    
          }
        });

      }
    });
  }

  $scope.editImage=function(){
    $scope.isImageEditMode=true;
    $scope.isImageUpdated=false;
  }

  $scope.onFileSelected=function(){
    $scope.isImageUpdated=true;
  }

  $scope.cancelImage=function(){
    $scope.isImageEditMode=false;
    $scope.isImageUpdated=false;
  }

  $scope.saveImage=function(){

    $productservice.uploadImage($scope.product,$scope.file).then(function (resp) { //upload function returns a promise
      if(resp.data.rc === 0){ //validate success
        $scope.product.image=resp.data.location;
        $scope.cancelImage();
      } else {
        console.log("error");
      }
    }, function (resp) { //catch error
      //console.log('Error status: ' + resp.status);
    }, function (evt) {
      //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  }
}])
.controller('VendorController',['$scope','$state','$mdDialog','$vendorservice','$userservice','$locationservice','$dataType', '$vendordata',function($scope,$state,$mdDialog,$vendorservice,$userservice,$locationservice,$dataType,$vendordata) {
        
  $scope.user=$userservice.get();
        
        
  $scope.showNewVendorDialog=function(event) {
    $mdDialog.show({
      targetEvent: event,
      scope: $scope,
      preserveScope: true,
      clickOutsideToClose:true,
      templateUrl: '/www/views/'+$scope.user['usertype']+'/vendor.new.html',
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
    var _foundprimary = false;
    var _cnt = _vendor.VendorContacts.length;
    for (_i = 0; _i < _cnt && !_foundprimary; _i++) {
      if (_vendor.VendorContacts[_i].isprimary == 1) {
        _abcnt = _vendor.VendorContacts[_i].VendorContactAddressBooks.length;
        for (_j = 0; _j < _abcnt && !_foundprimary; _j++) {
          if (_vendor.VendorContacts[_i].VendorContactAddressBooks[_j].isprimary == 1) {
            _primary = {
              VendorId: _vendor.id,
              ContactName:_vendor.VendorContacts[_i].name,
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
            ContactName:_vendor.VendorContacts[_i].name,
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
            VendorId: _vendor.id,
            ContactName:_vendor.VendorContacts[_i].name,
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
    return _primary;
  };


  if($dataType=='vendors'){
      $scope.vendors=[];
    //$scope.vendors=$data.data.data;
    _count=$vendordata.data.data.length;
    for(_c=0;_c<_count;_c++){
      _data=$vendordata.data.data[_c];  
      _cnt=_data.length;  
      _i=0; _j=0; 
      _abcnt = _data.VendorContacts[_i].VendorContactAddressBooks.length;
      if (_abcnt > 0) {
          _primary = {
            id: _data.id,
            name: _data.name,    
            address: _data.VendorContacts[_i].VendorContactAddressBooks[_j].formattedaddress,
            city: _data.VendorContacts[_i].VendorContactAddressBooks[_j].city,
            phone: _data.VendorContacts[_i].VendorContactAddressBooks[_j].phone,
            zipcode: _data.VendorContacts[_i].VendorContactAddressBooks[_j].zipcode,
          };
      }else{
          _primary = {
            id: _data.id,
            name: _data.name, 
            address:'n/a',
            city: 'n/a',
            phone: 'n/a',
            zipcode: 'n/a',
          };
      }
      $scope.vendors.push(_primary);
    }    

  }

  if($dataType=='vendor') {
    _data = $vendordata.data.data;
    _primary = getPrimary(_data);
    $scope.vendor = {
      id: _data.id,
      name: _data.name,
      createdAt: _data.createdAt,
      updatedAt: _data.updatedAt,
    };
    $scope.vendor.primary = angular.copy(_primary);
  }
}])
.controller('DialogController', function ($scope, $mdDialog,$userservice,$orderservice) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide();
    };
    $scope.status = '  ';
    $scope.showAlert = function(message) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#appcontainer')))
          .clickOutsideToClose(true)
          .title('This is an alert title')
          .textContent('You can specify some description text in here.')
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
      );
    };
    
    $scope.user=$userservice.get();
  })
.controller('appNavigationController', function ($rootScope,$scope, $timeout, $mdSidenav,$userservice) {
    $scope.title="Online Store";  
    $scope.isLogged=$rootScope.isLogged;
    $scope.showMobileMainHeader = true;    
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildDelayedToggler('right');
    $scope.user=$userservice.get();
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
          args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
      }
    }
    $scope.$on('EventUserLogged', function(event,args){ 
        $scope.isLogged=args.success;
        $scope.user=$userservice.get();
    }); 
   
  })
.controller('MenuController', function ($scope,$state,$mdSidenav,$userservice,$menudata) {
    $scope.items=[];
    $scope.user=$userservice.get();
    $scope.close = function () {
      $mdSidenav('left').close();
    };
    $scope.$on('$UserLogged', function(event,args){ 
       $scope.init();
    });    
    
    $scope.init=function(){
        if($userservice.get().id==undefined){
            $state.go('app.login');
        }
        if($menudata['data']){
            $scope.items=$menudata.data.menuoptions;
            $userservice.save('details',{'menu':$menudata.data.menuoptions});
        }else if($menudata['menu']){
            $scope.items=$menudata.menu;
        }
        
        $scope.menuready=true;
    };
    
    $scope.load=function(path){
        if(path=="logout"){
            $scope.$emit('$UserExpired');
            return false;
        }
        $state.go('app.user.'+path,{userid:$userservice.get().id,usertype:($userservice.get().usertype)});
    }
    
  })
.controller('appRightSideBarController', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close();
    };
    $scope.open = function () {
      $mdSidenav('right').open();
    };
    
    
  })
.controller('appViewController',function($rootScope,$scope,$state,$restservice,$userservice,$mdDialog) {
    $scope.load=function(path){
      $state.go(path);
    };
    $scope.entity={
        'username':'',
        'password':''
    };
    $scope.isLogged=$rootScope.isLogged;
    var _user=$userservice.get();
    if(_user && _user['id']!=undefined){
        $scope.isLogged=true;
        $scope.$broadcast('$UserLogged', { success: true,authkey:_user['authkey']});
        $state.go('app.user.orders',{userid:_user['id'],usertype:_user['usertype']}); 
    }
    $scope.login=function(){
        $userservice.login($scope.entity).then(function(response){
            if(response.data.rc==-1){
              $scope.processing=false;    
              $scope.errormessage="Invalid Details";
              $scope.entity.password.$dirty=true;  
            }else{
                $scope.isLogged=true;
                $rootScope.isLogged=true;
                $rootScope.token=response.data.data.authkey;
                $scope.entity.password="";
                $userservice.put(response.data.data.id,response.data.data.authkey,(response.data.data.type).toLowerCase());
                $scope.$broadcast('$UserLogged', { success: true,authkey:response.data.data.authkey });
                $state.go('app.user.orders',{usertype:(response.data.data.type).toLowerCase(),userid:response.data.data.id});
            }            
        }).catch(function(error){
            
        });
    };
    $scope.$on('$UserExpired', 
        function(event){ 
            $scope.isLogged=false;
    });  
    $scope.$on('$stateNotFound', function(event,args){ 
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#appcontainer')))
          .clickOutsideToClose(true)
          .title("error")
          .textContent("Invalid Request")
          .ariaLabel('Alert Dialog')
          .ok('Ok')
      );
    });    
  })
  
;

angular
.module('store', ['ui.router', 'store.controllers','store.services','ngMaterial','ui.router','md.data.table','angular-md5','ngFileUpload','angular-cache'])
.run(function ($rootScope, $state, $stateParams,$http,$userservice) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$domain="http://localhost";
    $rootScope.isLogged=false;
    var _usr=$userservice.get();
    if(_usr==undefined){
        console.log("user not found at begin");
        $state.go('app.login');
    }else{
        $rootScope.isLogged=(_usr.id)?_usr.id:false;
        $rootScope.token=(_usr.token)?_usr.token:'undefined';
    }
    
    $rootScope.display_view_progress_bar=true;
    $rootScope.$on('$UserLogged', function(event,args){ 
        $rootScope.isLogged=args.success;
        $rootScope.token=args.token;
    });
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          $rootScope.display_view_progress_bar=true;
    });
    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
          $rootScope.display_view_progress_bar=false;
    }); 
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        $userservice.remove();
        $rootScope.isLogged=false;
        $rootScope.token=undefined; 
        console.log("on state error");
        console.log(event);
        $state.go('app.login');
    });    
    $rootScope.$on('$stateNotFound', 
    function(event, unfoundState, fromState, fromParams){ 
        $rootScope.display_view_progress_bar=true;
        console.log('$stateNotFound');
    });
    $rootScope.$on('$UserExpired', 
    function(event){ 
        $userservice.remove();
        $rootScope.isLogged=false;
        console.log("on user expired");
        $state.go("app.login");
    });    
    
})
.config(function (CacheFactoryProvider) {
  angular.extend(CacheFactoryProvider.defaults, { maxAge: 15 * 60 * 1000 });
})
.config(['$httpProvider', function($httpProvider) {
        
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    
    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    $httpProvider.interceptors.push('sessionInjector');
}])
.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
  $stateProvider
    .state('app', {
      abstract: true,         
      url: '/app',
      templateUrl: '/www/views/app.html',
      controller: 'appViewController'
    })
    .state('app.login', {
    url: '/login',
      views:{
        "top":{
          templateUrl: '/www/views/top.html',
          controller: 'appNavigationController',
        }
      }
    })    
    .state('app.user', {
     url: '/user',
     abstract: true, 
      views:{
        "top":{
          templateUrl: '/www/views/top.html',
          controller: 'appNavigationController',
        },          
        "content":{
          templateUrl:'/www/views/main.html',
        }
      }
    }) 
    .state('app.user.orders', {
      url: '/{usertype:[a-zA-Z0-9]+}@{userid:[a-zA-Z0-9]+}/orders/',
      views:{
        "menu":{
          templateUrl: '/www/views/menu.html', 
          controller: 'MenuController',
        },  
        "content":{
          templateUrl: function($stateParams){return '/www/views/'+$stateParams['usertype']+'/orders.html'},
          controller: 'OrderController',
        }
      },
      resolve:{
          $menudata:['$stateParams','$userservice',
            function($stateParams,$userservice){
              return $userservice.getDetails();
            }],
          $orderType:function(){return "orders";},  
          $orderdata:['$stateParams','$orderservice',
            function($stateParams,$orderservice){
              return $orderservice.get();
            }] 
      }
    })  
    .state('app.user.order', {
      url: '/{usertype:[a-zA-Z0-9]+}@{userid:[a-zA-Z0-9]+}/orders/{orderid:[a-zA-Z0-9]+}/',
      views:{
        "menu":{
          templateUrl: '/www/views/menu.html', 
          controller: 'MenuController',
        },  
        "content":{
          templateUrl: function($stateParams){
              return '/www/views/'+$stateParams['usertype']+'/orders.id.html'
          },
          controller: 'OrderController',
        }
      },
      resolve:{
          $menudata:['$stateParams','$userservice',
            function($stateParams,$userservice){
              return $userservice.getDetails();
            }],
          $orderType:function(){return "order";},  
          $orderdata:['$stateParams','$orderservice',
            function($stateParams,$orderservice){
              return $orderservice.getById($stateParams['orderid']);
            }] 
      },
    })  
    .state('app.user.products', {
      url: '/{usertype:[a-zA-Z0-9]+}@{userid:[a-zA-Z0-9]+}/products/',
      views:{
        "menu":{
          templateUrl: '/www/views/menu.html', 
          controller: 'MenuController',
        },  
        "content":{
          templateUrl: function($stateParams){return '/www/views/'+$stateParams['usertype']+'/products.html'},
          controller: 'ProductController',
        }
      },
      resolve:{
          $menudata:['$stateParams','$userservice',
            function($stateParams,$userservice){
              return $userservice.getDetails();
            }],
          $productType:function(){return "products";},  
          $productdata:['$stateParams','$productservice',
            function($stateParams,$productservice){
              return $productservice.get();
            }] 
      }
    })
    .state('app.user.product', {
      url: '/{usertype:[a-zA-Z0-9]+}@{userid:[a-zA-Z0-9]+}/products/{productid:[a-zA-Z0-9]+}/',
      views:{
        "menu":{
          templateUrl: '/www/views/menu.html', 
          controller: 'MenuController',
        },  
        "content":{
          templateUrl: function($stateParams){
              return '/www/views/'+$stateParams['usertype']+'/products.id.html'
          },
          controller: 'ProductController',
        }
      },
      resolve:{
          $menudata:['$stateParams','$userservice',
            function($stateParams,$userservice){
              return $userservice.getDetails();
            }],
          $productType:function(){return "product";},  
          $productdata:['$stateParams','$productservice',
            function($stateParams,$productservice){
              return $productservice.getById($stateParams['productid']);
            }] 
      },
    })
    .state('app.user.vendors', {
      url: '/{usertype:[a-zA-Z0-9]+}@{userid:[a-zA-Z0-9]+}/vendors/',
      views:{
        "menu":{
          templateUrl: '/www/views/menu.html', 
          controller: 'MenuController',
        },  
        "content":{
          templateUrl: function($stateParams){return '/www/views/'+$stateParams['usertype']+'/vendors.html'},
          controller: 'VendorController',
        }
      },
      resolve:{
          $menudata:['$stateParams','$userservice',
            function($stateParams,$userservice){
              return $userservice.getDetails();
            }],
          $dataType:function(){return "vendors";},  
          $vendordata:['$stateParams','$vendorservice',
            function($stateParams,$vendorservice){
              return $vendorservice.get();
            }] 
      }
    })  
    .state('app.user.vendor', {
      url: '/{usertype:[a-zA-Z0-9]+}@{userid:[a-zA-Z0-9]+}/vendors/{vendorid:[a-zA-Z0-9]+}/',
      views:{
        "menu":{
          templateUrl: '/www/views/menu.html', 
          controller: 'MenuController',
        },  
        "content":{
          templateUrl: function($stateParams){
              return '/www/views/'+$stateParams['usertype']+'/vendors.id.html'
          },
          controller: 'VendorController',
        }
      },
      resolve:{
          $menudata:['$stateParams','$userservice',
            function($stateParams,$userservice){
              return $userservice.getDetails();
            }],
          $dataType:function(){return "vendor";},  
          $vendordata:['$stateParams','$vendorservice',
            function($stateParams,$vendorservice){
              return $vendorservice.getById($stateParams['vendorid']);
            }] 
      },
    })    
    .state('app.user.customers', {
      url: '/{usertype:[a-zA-Z0-9]+}@{userid:[a-zA-Z0-9]+}/customers/',
      views:{
        "menu":{
          templateUrl: '/www/views/menu.html', 
          controller: 'MenuController',
        },  
        "content":{
          templateUrl: function($stateParams){return '/www/views/'+$stateParams['usertype']+'/customers.html'},
          controller: 'CustomerController',
        }
      },
      resolve:{
          $menudata:['$stateParams','$userservice',
            function($stateParams,$userservice){
              return $userservice.getDetails();
            }],
          $dataType:function(){return "customers";},  
          $customerdata:['$stateParams','$customerservice',
            function($stateParams,$customerservice){
              return $customerservice.get();
            }] 
      }
    })  
    .state('app.user.customer', {
      url: '/{usertype:[a-zA-Z0-9]+}@{userid:[a-zA-Z0-9]+}/customers/{customerid:[a-zA-Z0-9]+}/',
      views:{
        "menu":{
          templateUrl: '/www/views/menu.html', 
          controller: 'MenuController',
        },  
        "content":{
          templateUrl: function($stateParams){
              return '/www/views/'+$stateParams['usertype']+'/customers.id.html'
          },
          controller: 'CustomerController',
        }
      },
      resolve:{
          $menudata:['$stateParams','$userservice',
            function($stateParams,$userservice){
              return $userservice.getDetails();
            }],
          $dataType:function(){return "customer";},  
          $customerdata:['$stateParams','$customerservice',
            function($stateParams,$customerservice){
              return $customerservice.getById($stateParams['customerid']);
            }] 
      },
    }) 
    .state('app.user.employees', {
      url: '/{usertype:[a-zA-Z0-9]+}@{userid:[a-zA-Z0-9]+}/employees/',
      views:{
        "menu":{
          templateUrl: '/www/views/menu.html', 
          controller: 'MenuController',
        },  
        "content":{
          templateUrl: function($stateParams){return '/www/views/'+$stateParams['usertype']+'/employees.html'},
          controller: 'EmployeeController',
        }
      },
      resolve:{
          $menudata:['$stateParams','$userservice',
            function($stateParams,$userservice){
              return $userservice.getDetails();
            }],
          $dataType:function(){return "employees";},  
          $employeedata:['$stateParams','$employeeservice',
            function($stateParams,$employeeservice){
              return $employeeservice.get();
            }] 
      }
    })  
    .state('app.user.employee', {
      url: '/{usertype:[a-zA-Z0-9]+}@{userid:[a-zA-Z0-9]+}/employees/{employeeid:[a-zA-Z0-9]+}/',
      views:{
        "menu":{
          templateUrl: '/www/views/menu.html', 
          controller: 'MenuController',
        },  
        "content":{
          templateUrl: function($stateParams){
              return '/www/views/'+$stateParams['usertype']+'/employees.id.html'
          },
          controller: 'EmployeeController',
        }
      },
      resolve:{
          $menudata:['$stateParams','$userservice',
            function($stateParams,$userservice){
              return $userservice.getDetails();
            }],
          $dataType:function(){return "employee";},  
          $employeedata:['$stateParams','$employeeservice',
            function($stateParams,$employeeservice){
              return $employeeservice.getById($stateParams['employeeid']);
            }] 
      },
    })     
  ;
  $urlRouterProvider.otherwise("/app/login");
}])
;