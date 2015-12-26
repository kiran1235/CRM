/**
 * Created by kiran talapaku on 12/26/15.
 */


angular.module('crm',['ngMaterial','ui.router'])
  .run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  })
  //Services
  .service('VendorService',['$http',function($http){
    this.getVendors=function(){
      return $http.get('http://localhost:3000/vendors');

    };
    this.getVendor=function(vendorid){
      return $http.get('http://localhost:3000/vendor/'+vendorid);
    };
    this.createVendor=function(formObject){
      console.log("i m saved");
      return $http({
        method:'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url:'http://localhost:3000/vendor/',
        data:formObject,
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push("entity["+encodeURIComponent(p) + "]=" + encodeURIComponent(obj[p]));
          return str.join('&');
        },
      });
    }
  }])
  .service('CustomerService',['$http',function($http){
    this.getCustomers=function(){
      return $http.get('http://localhost:3000/customers');

    }
  }])

  //Routing, Configurations

  .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");

    var vendors={
      name:'vendors',
      url:'/vendors.html',
      resolve: {
        Vendors: ['VendorService',
          function (VendorService) {
            return VendorService.getVendors();
          }]
      },
      templateUrl: 'vendors.html',
      controller: 'VendorsController'
    };

    var vendor={
      name:'vendor_one',
      url:'/vendor/:vendorid.html',
      resolve:{
        Vendor:['$stateParams','VendorService',
          function($stateParams,VendorService){
            return VendorService.getVendor($stateParams.vendorid);
          }]
      },
      templateUrl:'vendor.html',
      controller:'VendorController'
    };

    $stateProvider
      .state('vendors',vendors)
      .state('vendor_one',vendor)
      .state('customers',{
        url:'/customers',
        resolve:{
          Customers:['CustomerService',
            function(CustomerService){
              return CustomerService.getCustomers();
            }]
        },
        controller:'CustomersController',
        'templateUrl':'customers.html'
      })

  }])
  .config(function($mdIconProvider) {
    $mdIconProvider
      .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24);
  })

  //Dialog
  .factory('Dialog', ['$mdDialog', function DialogFactory ($mdDialog) {
    return {
      open: function (url, ctrl, locals) {
        return $mdDialog.show({
          templateUrl: url,
          controller: ctrl,
          locals: {
            items: locals
          }
        });
      },
    }
  }])
  .controller('DialogController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide();
    }
  }])

  //Controllers
  .controller('appNavigationController', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.showMobileMainHeader = true;
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildDelayedToggler('right');
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
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
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
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
  })
  .controller('appLeftSideBarController', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
        });
    };
  })
  .controller('appRightSideBarController', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
        });
    };
  })
  .controller('appViewController',['$scope','$state',function($scope,$state) {
    $scope.load=function(path){
      $state.go(path);
    };
  }])
  .controller('VendorsController',['$scope','$state','$mdDialog','Vendors',
    function($scope,$state,$mdDialog,Vendors) {
      $scope.vendorNames=Vendors.data.data;
      $scope.load=function(vendor){
        $state.go('vendor_one',{vendorid:vendor.id});
      };
      $scope.showNewForm=function(){
        $mdDialog.show({
          templateUrl: 'newvendor.html',
          controller: 'VendorsController',
        });
      };
      $scope.createVendor=function(){
      };
    }])
  .controller('VendorsController',['$scope','$state','$mdDialog','Vendors',
    function($scope,$state,$mdDialog,Vendors) {
      $scope.vendorNames=Vendors.data.data;
      $scope.load=function(vendor){
        $state.go('vendor_one',{vendorid:vendor.id});
      };
      $scope.showNewForm=function(){
        $mdDialog.show({
          templateUrl: 'newvendor.html',
          controller: ('NewVendorController',['$scope','$state','$mdDialog','VendorService',
            function($scope,$state,$mdDialog,vendorservice) {
              $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
              'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
              'WY').split(' ').map(function(state) {
                return {abbrev: state};
              });
              $scope.entity={
                name:'test angular',
                contactname:'test angular contact name',
                addressline1:'sample',
                addressline2:'suite #1',
                city:'sample',
                state:'AL',
                country:'USA',
                zipcode:'12345',
                email:'na@default',
                phone:'0000000000',
              }
              $scope.save=function(){
                vendorservice.createVendor($scope.entity).success(function(data){
                  if(data.rc>=0){
                    $mdDialog.cancel();
                    $state.go('vendor_one',{vendorid:data.VendorId});
                  }
                });
              };
              $scope.cancel=function(){
                $mdDialog.cancel();

              };
            }])
        });
      };
      $scope.createVendor=function(){
      };
    }])
  .controller('VendorController',['$scope','$state','Vendor',
    function($scope,$state,Vendor) {
      if(Vendor.data.rc==-1){
        $state.go('vendors');
      }else{
        $scope.vendor=Vendor.data.data;
        $scope.isAddressExists=$scope.vendor.VendorAddressBooks.length;
        if($scope.isAddressExists<=0){
          angular.forEach($scope.vendor.VendorContacts,function(value,key){
            if(value.VendorContactAddressBooks.length>0){
              $scope.isAddressExists=1;
              return 1;
            }
          });
        }
      }
    }])
  .controller('CustomersController',['$scope','Customers',
    function($scope, Customers) {
      $scope.customerNames=Customers.data.data;
    }]);
