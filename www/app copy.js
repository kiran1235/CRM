/**
 * Created by kiran talapaku on 12/26/15.
 */


var app = angular.module('crm',['ngMaterial','ui.router','md.data.table','angular-md5','ngFileUpload']);

app
  .run(function ($rootScope, $state, $stateParams,$http) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.display_view_progress_bar=false;
    $rootScope
      .$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          $rootScope.display_view_progress_bar=true;
        });

    $rootScope
      .$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
          $rootScope.display_view_progress_bar=false;
        });
  })
  //Routing, Configurations

  .config(function($mdIconProvider) {
    $mdIconProvider
      .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24);
  })

  ////Dialog
  //.factory('Dialog', ['$mdDialog', function DialogFactory ($mdDialog) {
  //  return {
  //    open: function (url, ctrl, locals) {
  //      return $mdDialog.show({
  //        templateUrl: url,
  //        controller: ctrl,
  //        locals: {
  //          items: locals
  //        }
  //      });
  //    },
  //  }
  //}])

  .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('customers',{
        url:'/customers/',
        resolve:{
          $customers:['CustomerService',
            function(CustomerService){
              return CustomerService.getCustomers();
            }]
        },
        controller:'CustomersController',
        'templateUrl':'customers.html'
      })
      .state('inventory',{
        url:'/inventory/',
        resolve: {
          $products: ['$productservice',
            function ($productservice) {
              return $productservice.inventory.get();
            }]
        },
        controller:'InventoryController',
        'templateUrl':'/www/partials/inventory.html'
      })
      .state('vendors',{
        name:'vendors',
        url:'/vendors/',
        resolve: {
          $dataType:function(){return "vendors";},
          $data: ['$vendorservice',
            function ($vendorservice) {
              return $vendorservice.getVendors();
            }]
        },
        templateUrl:'/www/partials/vendors.html',
        controller: 'VendorController'
      })
      .state('vendor',{
        name:'vendor',
        url:'/vendors/@{vendorid:[0-9]+}.html',
        resolve:{
          $dataType:function(){return "vendor";},
          $data:['$stateParams','$vendorservice',
            function($stateParams,$vendorservice){
              return $vendorservice.getVendor($stateParams.vendorid);
            }],
        },
        templateUrl:'/www/partials/vendors.id.html',
        controller:'VendorController'
      })
      .state('product',{
        url:'/product/@{productid:[0-9]+}.html',
        resolve: {
          $product: ['$stateParams','$productservice',
            function ($stateParams,$productservice) {
              return $productservice.getById($stateParams.productid);
            }]
        },
        controller:'ProductController',
        'templateUrl':'/www/partials/product.id.html'
      })
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
      $mdSidenav('left').close();
    };
  })
  .controller('appRightSideBarController', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close();
    };
  })
  .controller('appViewController',['$scope','$state',function($scope,$state) {
    $scope.load=function(path){
      $state.go(path);
    };
  }])
;
