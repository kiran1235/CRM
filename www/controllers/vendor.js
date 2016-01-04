/**
 * Created by kiran on 12/28/15.
 */
app
  .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('vendors',{
        name:'vendors',
        url:'/vendors/',
        resolve: {
          $vendor: ['$vendorservice',
            function ($vendorservice) {
              return $vendorservice.getVendors();
            }]
        },
        templateUrl:'/www/partials/vendors.html',
        controller: 'VendorsController'
      })
      .state('vendor',{
        name:'vendor',
        url:'/vendors/@{vendorid:[0-9]+}.html',
        resolve:{
          $vendor:['$stateParams','$vendorservice',
            function($stateParams,$vendorservice){
              return $vendorservice.getVendor($stateParams.vendorid);
            }]
        },
        templateUrl:'/www/partials/vendors.id.html',
        controller:'VendorController'
      })
  }])
  .controller('VendorsController',['$scope','$state','$mdDialog','$vendor',
    function($scope,$state,$mdDialog,$vendors) {

      $scope.vendorNames=$vendors.data.data;
      //$scope.load=function(vendor){
      //  $state.go('vendor_id',{vendorid:vendor.id});
      //};
      $scope.showNewForm=function(){
        $mdDialog.show({
          templateUrl: 'newvendor.html',
          controller: ('NewVendorController',['$scope','$state','$mdDialog','$vendorservice',
            function($scope,$state,$mdDialog,$vendorservice) {
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
                $vendorservice.createVendor($scope.entity).success(function(data){
                  if(data.rc>=0){
                    $mdDialog.cancel();
                    $state.go('vendor',{vendorid:data.VendorId});
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
  .controller('VendorController',['$scope','$state','$vendor',
    function($scope,$state,$vendor) {
      if($vendor.data.rc==-1){
        $state.go('vendors');
      }else{
        $scope.vendor=$vendor.data.data;
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