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
    .service('$vendorservice',['$http',function($http){
        this.getVendors=function(){
            return $http.get('http://localhost:3000/api/vendors');

//sample data            
//{"rc":0,"data":[{"id":13,"name":"walmar","VendorContacts":[{"id":13,"isprimary":0,"VendorContactAddressBooks":[{"phone":"4088851142","formattedaddress":"777 Story Rd, San Jose, CA 95122, USA","latitude":37.3310001,"longitude":-121.860433}]}]}]}
            
        }
    }])
    .service('$customerservice',['$http',function($http){

    }])
    

;


angular.module('store.controllers', [])
    .controller('AppCtrl', function($scope,$locationservice,$customerservice,$vendorservice,$cartservice) {
         $scope.vendors = [];
         $scope.customer.deliveryAddress={
                   formattedaddress:'',
                   latitude:0.0,
                   longitude:0.0
        };
    
        $scope.setDeliveryAddress=function(street,city,state){
           $locationservice.findAddress(street,city,state).then(function(location){
               $scope.customer.deliveryAddress={
                   formattedaddress:location.data.results[0].formatted_address,
                   latitude:location.data.results[0].geometry.location.lat,
                   longitude:location.data.results[0].geometry.location.lng               
               }
           }).catch(function(error){
               
           }); 
        }
    
        $scope.getVendors=function(){
            $vendorservice.getVendors().then(function(response){
                if(response.data.rc>0){
                    _vendors=[];
                    _vcnt = response.data.data.length;
                    for (_i = 0; _i < _vcnt ; _i++) {
                        
                    }
                    $scope.vendors=response.data.data;
                }
            }).catch(function(){
                
            });
        }
        
        
    })
;



angular
    .module('store', ['ui.router', 'store.controllers','store.services'])
    .run(function ($rootScope, $state, $stateParams,$http) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    })
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
      
      $stateProvider
        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/store.html',
        controller: 'AppCtrl'
      })
      ;
      $urlRouterProvider.otherwise("/app");
    }])
;