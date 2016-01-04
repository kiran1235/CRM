/**
 * Created by kiran on 12/28/15.
 */
app
  .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('inventory',{
        url:'/inventory',
        resolve: {
          $products: ['$productservice',
            function ($productservice) {
              return $productservice.inventory.get();
            }]
        },
        controller:'InventoryController',
        'templateUrl':'/www/partials/inventory.html'
      })
  }])
  .controller('InventoryController',['$scope','$state','$mdDialog','$productservice','$products',function($scope,$state,$mdDialog,$productservice,$products){

    $scope.products=$products.data;

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
      if(product.id==$scope.selected.id && product.Inventories.length<=0){
        return 'new_product_row';
      }else if(product.id==$scope.selected.id && product.Inventories.length>=1){
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
          angular.forEach($scope.products.data,function(product,key){
            if(product.id==$scope.selected.id){
              $scope.products.data[key]=angular.copy($scope.selected);
            }
          });
          $scope.cancel();
        }
      });
    }



    $scope.addInventory=function(product){
      $productservice.inventory.update(product).success(function(data){
        if(data.rc>=0){
          angular.forEach($scope.products.data,function(product,key){
            if(product.id==$scope.selected.id){
              $scope.products.data[key]=angular.copy($scope.selected);
            }
          });
          $scope.cancel();
        }
      });
    }


    $scope.showNewForm=function(){
      $mdDialog.show({
        templateUrl: '/www/partials/newproduct.html',
        controller: ('NewProductController',['$scope','$state','$mdDialog','$productservice','$rootScope',
          function($scope,$state,$mdDialog,$productservice,$rootScope) {
            $scope.entity={
              name:'test product',
              type:'test type',
              model:'test model',
              category:'test category',
              subcategory:'test sub category',
              serialnumber:'0000000000',
              vendorname:'test angular vendor'
            }
            $scope.save=function(){
              $productservice.create($scope.entity).success(function(data){
                if(data.rc>=0){
                  $mdDialog.cancel();
                  $productservice.raise('onProductUpdated');
                }
              });
            };
            $scope.cancel=function(){
              $mdDialog.cancel();

            };
          }])
      });
    };
  }])
;