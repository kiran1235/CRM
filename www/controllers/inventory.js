/**
 * Created by kiran on 12/28/15.
 */
app
  .controller('InventoryController',['$scope','$state','$mdDialog','$productservice','$products',function($scope,$state,$mdDialog,$productservice,$products){

    //$scope.vendor={};
    //$scope.currentVendor={};
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
            inventoryId:false
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
        templateUrl: '/www/partials/newproduct.html',
        controller: function($scope,$mdDialog) {
          console.log($scope.currentVendor);
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

    console.log($scope.isvendor);


  }])
;