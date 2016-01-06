/**
 * Created by kiran on 1/4/16.
 */
/**
 * Created by kiran on 12/28/15.
 */
app
  .controller('ProductController',['$scope','$state','$mdDialog','$productservice','$product',function($scope,$state,$mdDialog,$productservice,$product){

    $scope.detailineditmode=false;
    $scope.selectedInventory = {};
    $scope.selectedProduct = {};

    _inventories=[];
    _data=$product.data.data;
    _datalength=$product.data.data.length;
    for(iv=0;iv<_data.Inventories.length;iv++){
      _cr=_data.Inventories[iv].createdAt.slice(0,10);
      _upd=_data.Inventories[iv].updatedAt.slice(0,10);
      _data.Inventories[iv].createdAt=_cr;
      _data.Inventories[iv].updatedAt=_upd;
      _inventories.push(_data.Inventories[iv]);
    }


    _product={};

    for(key in _data){
      if(!Array.isArray(_data[key])){
        _product[key]=_data[key];
      }
    }

    $scope.product=_product;
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

    //$scope.addInventory=function(inventory){
    //  inventory['inventoryId']=inventory.id;
    //  inventory['id']=inventory.ProductId;
    //  $productservice.inventory.create(inventory).success(function(data){
    //    if(data.rc>=0){
    //      angular.forEach($scope.inventories,function(inventory,key){
    //        if(inventory.id==$scope.selectedInventory.id){
    //          $scope.inventories[key]=angular.copy($scope.selectedInventory);
    //        }
    //      });
    //      $scope.cancelEditInventory();
    //    }
    //  });
    //}

    $scope.updateInventory=function(inventory){
      inventory['inventoryId']=inventory.id;
      inventory['id']=inventory.ProductId;
      $productservice.inventory.update(inventory).success(function(data){
        if(data.rc>=0){
          angular.forEach($scope.inventories,function(inventory,key){
            if(inventory.id==$scope.selectedInventory.id){
              $scope.inventories[key]=angular.copy($scope.selectedInventory);
            }
          });
          $scope.cancelEditInventory();
        }
      });
    }


    //$scope.selected = {};
    //$scope.query = {
    //  order: 'id',
    //  limit: 5,
    //  page: 1
    //};
    //
    //$scope.$on('onProductUpdated',function(){
    //  $productservice.getProducts().success(function(data){
    //    $scope.products=data;
    //  });
    //});
    //
    //$scope.getTemplate=function(product){
    //  if(product.id==$scope.selected.id){
    //    return 'edit_product_row';
    //  }else{
    //    return 'display_product_row';
    //  }
    //}
    //
    //$scope.edit=function(product){
    //  $scope.selected = angular.copy(product);
    //}
    //
    //$scope.cancel=function(){
    //  $scope.selected = {};
    //}
    //
    //$scope.update=function(product){
    //  $productservice.inventory.update(product).success(function(data){
    //    if(data.rc>=0){
    //      angular.forEach($scope.products,function(product,key){
    //        if(product.id==$scope.selected.id){
    //          $scope.products[key]=angular.copy($scope.selected);
    //        }
    //      });
    //      $scope.cancel();
    //    }
    //  });
    //}
    //
    //$scope.addInventory=function(product){
    //  $productservice.inventory.create(product).success(function(data){
    //    if(data.rc>=0){
    //      angular.forEach($scope.products,function(product,key){
    //        if(product.id==$scope.selected.id){
    //          $scope.products[key]=angular.copy($scope.selected);
    //        }
    //      });
    //      $scope.cancel();
    //    }
    //  });
    //}
    //
    //
    //$scope.showNewForm=function(){
    //  $mdDialog.show({
    //    templateUrl: '/www/partials/newproduct.html',
    //    controller: ('NewProductController',['$scope','$state','$mdDialog','$productservice','$rootScope',
    //      function($scope,$state,$mdDialog,$productservice,$rootScope) {
    //        $scope.entity={
    //          name:'test product',
    //          type:'test type',
    //          model:'test model',
    //          category:'test category',
    //          subcategory:'test sub category',
    //          serialnumber:'0000000000',
    //          vendorname:'test angular vendor'
    //        }
    //        $scope.save=function(){
    //          $productservice.create($scope.entity).success(function(data){
    //            if(data.rc>=0){
    //              $mdDialog.cancel();
    //              $productservice.raise('onProductUpdated');
    //            }
    //          });
    //        };
    //        $scope.cancel=function(){
    //          $mdDialog.cancel();
    //
    //        };
    //      }])
    //  });
    //};
  }])
;