angular.module('store.services', [])
    .service('$locationservice',['$http',function($http){
        this.findAddress=function(street,city,state){
          street = street.split(' ').join('+');
          return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+street+',+'+city+',+'+state);
        };
        this.calcDistance=function(fromLatitude,fromLongitude,toLatitude,toLongitude){
            return (3963.0 *  Math.acos(Math.sin(fromLatitude/57.2958) *   Math.sin(toLatitude/57.2958) + Math.cos(fromLatitude/57.2958) *  Math.cos(toLatitude/57.2958) * Math.cos(toLongitude/57.2958 - fromLongitude/57.2958)));
        };
    }])
    .service('$vendorservice',['$rootScope','$http',function($rootScope,$http){
        this.getVendors=function(){
            return $http.get($rootScope.$domain+'/store/api/vendors');

//sample data
//{"rc":0,"data":[{"id":13,"name":"walmar","VendorContacts":[{"id":13,"isprimary":0,"VendorContactAddressBooks":[{"phone":"4088851142","formattedaddress":"777 Story Rd, San Jose, CA 95122, USA","latitude":37.3310001,"longitude":-121.860433}]}]}]}

        },

        this.getVendorProducts=function(id){
            return $http.get($rootScope.$domain+'/store/api/vendors/'+id+'/products/');
        }

    }])
    .service('$cartservice',['$http',function($http){
        if(this.items==undefined){
            this.items=[];
        }
        this.totalvalue=0;
        this.addItem=function(item){
          for (var i = 0; i < this.items.length; i++) {
            if(item.id==this.items[i].id){
              this.totalvalue=this.totalvalue-(this.items[i].cartquantity*item.Inventories[0].unitprice);
              this.items[i].cartquantity=item.cartquantity;
              return;
            }
          }
          this.items.push(item);
        };
        this.getTotal=function(){
          this.totalvalue=0;
          for (var i = 0; i < this.items.length; i++) {
              this.totalvalue=this.totalvalue+(this.items[i].cartquantity*this.items[i].Inventories[0].unitprice);
          }
          return this.totalvalue;
        }
    }])
    .service('$customerservice',['$http',function($http){
        if(this.deliveryAddress==undefined){
            console.log("ddd");
             this.deliveryAddress={
                   street:'',
                   city:'',
                   state:'',
                   zipcode:'',
                   formattedaddress:'',
                   latitude:0.0,
                   longitude:0.0
            }            
        }
        
        this.setDeliveryAddress=function(address){
            this.deliveryAddress=address;
        }
        
        this.getDeliveryAddress=function(){
            return this.deliveryAddress;
        }
    }])

;


angular.module('store.controllers', [])
    .controller('CartCtrl', function($state,$stateParams,$scope,$locationservice,$vendorservice,$cartservice) {
        $scope.items=$cartservice.items;
        $scope.totalvalue=0;

        $scope.getTotal=function(){
          return $cartservice.getTotal();
        };
    })
    .controller('VendorCtrl', function($state,$stateParams,$scope,$locationservice,$vendorservice,$cartservice) {
        $scope.back=function(){
            $state.go("app.welcome");
        };
        
        $scope.vendor=$stateParams.vendor;
        $scope.products=[];
        $scope.getVendorProducts=function(vendor){
            $vendorservice.getVendorProducts(vendor.id).then(function(response){
              $scope.products=response.data.products;
              for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].cartquantity=0;
              }
            });
        };

        $scope.addProductToCart=function(product,quantity){
          $cartservice.addItem(product,product.name);
        };
        if($stateParams.vendor == undefined){
            $scope.back();
        }else{
            $scope.getVendorProducts($scope.vendor);
        }
        
    })
    .controller('AppCtrl', function($state,$scope,$locationservice,$vendorservice,$cartservice,$customerservice) {

         $scope.goToVendor=function(vendor){
             $state.go('app.vendor',{'vendor':vendor});
         }
         $scope.Math = window.Math;
         $scope.message="Welcome to grocery store";
         $scope.vendors = [];

         $scope.customer={deliveryAddress:$customerservice.getDeliveryAddress()};

        $scope.setDeliveryAddress=function(){
            _street=$scope.customer.deliveryAddress.street;
            _city=$scope.customer.deliveryAddress.city;
            _state=$scope.customer.deliveryAddress.state;
            _zipcode=$scope.customer.deliveryAddress.zipcode;
            $locationservice.findAddress($scope.customer.deliveryAddress.street,$scope.customer.deliveryAddress.city,$scope.customer.deliveryAddress.state).then(function(location){
               $scope.customer.deliveryAddress.formattedaddress=location.data.results[0].formatted_address,
               $scope.customer.deliveryAddress.latitude=location.data.results[0].geometry.location.lat,
               $scope.customer.deliveryAddress.longitude=location.data.results[0].geometry.location.lng
               $customerservice.setDeliveryAddress($scope.customer.deliveryAddress);            
               $scope.getVendors();
           }).catch(function(error){

           });
        };

        $scope.getVendors=function(){
            $vendorservice.getVendors().then(function(response){
                if(response.data.rc>=0){
                    _vendors=response.data.vendors;
                    _vcnt = _vendors.length;
                    for (_i = 0; _i < _vcnt ; _i++) {
                        _vccnt = _vendors[_i].VendorContacts.length;
                        for (_ci = 0; _ci < _vccnt ; _ci++) {
                            _vcacnt = _vendors[_i].VendorContacts[_ci].VendorContactAddressBooks.length;
                            for (_cai = 0; _cai < _vcacnt ; _cai++) {
                                $scope.vendors.push({
                                    'id':_vendors[_i].id,
                                    'name':_vendors[_i].name,
                                    'vendorcontactid':_vendors[_i].VendorContacts[_ci].id,
                                    'formattedAddress':_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].formattedaddress,
                                    'latitude':_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].latitude,
                                    'longitude':_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].longitude,
                                    'distance':$locationservice.calcDistance($scope.customer.deliveryAddress.latitude,$scope.customer.deliveryAddress.longitude,_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].latitude,_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].longitude)
                                })
                            }
                        }
                    }
                }
                $scope.showvendors=true;
            }).catch(function(){

            });
        };
    })
;



angular
    .module('store', ['ui.router', 'store.controllers','store.services'])
    .run(function ($rootScope, $state, $stateParams,$http) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$domain="http://localhost";
    })
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
      $stateProvider
        .state('app', {
          url: '/app',
          abstract: true, templateUrl: 'templates/welcome.html'
        })
        .state('app.welcome', {
        url: '/welcome',
          views:{
            "page":{
              templateUrl: 'templates/store.html',
              controller: 'AppCtrl',
            },
            "cart":{
              templateUrl: 'templates/cart.html',
              controller: 'CartCtrl'
            }
          }
        })
        .state('app.vendor', {
            url: '/vendor',
            params:{vendor: null},
            views:{
              "page":{
                templateUrl: 'templates/vendor.html',
                controller: 'VendorCtrl'
              },
              "cart":{
                templateUrl: 'templates/cart.html',
                controller: 'CartCtrl'
              }
            }

//            resolve:{
//                vendor:['$stateParams',function($stateParams){
//                    console.log($stateParams.id);
//                    return $stateParams.vendor;
//                }]
//            }
        })
      ;
      $urlRouterProvider.otherwise("/app/welcome");
    }])
;
