/**
 * @ngdoc function
 * @name tourismApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the tourismApp
 */  
angular.module('tourismApp')
  .controller('Update', function ($scope, $http, $httpParamSerializer, $httpParamSerializerJQLike, $rootScope, appService, constants, $state, $window,Map,$mdDialog ) {
    'use strict';
	
    $scope.change = function() {
        angular.element(document.querySelector('#example1'));
        var test = document.querySelector('#example1').value;
        $scope.SourceIdToUpload = test.substring(7);
      };
    
    $scope.change2 = function() {
        angular.element(document.querySelector('#example2'));
        var test = document.querySelector('#example2').value;
        $scope.DestinationIdToUpload = test.substring(7);
      };
    
    $scope.change3 = function() {
        angular.element(document.querySelector('#example3'));
        var test = document.querySelector('#example3').value;
        $scope.BusIdToUpload = test.substring(7);
      };
    
    
    
    
    $scope.DfoodId = [];
    $scope.DPrdList = [];
    $scope.user = {
          tkId: ''
        };
    
    $scope.selectedSourceName = '';
    
     $scope.selected = [];
     $scope.TotalWayPointTiming =  [];
     $scope.TimeListToSubmit = [];
    
      $scope.toggle = function (item, list,time,index) {
          var test = $scope.selected;
          $scope.TotalWayPointTiming[index+1] = time;
          
          
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
          
          
           var idxs = $scope.TotalWayPointTiming.indexOf(time);
        if (idxs > -1) $scope.TotalWayPointTiming.splice(idxs, 1);
        else $scope.TotalWayPointTiming.push(time);
          
          
          
      };

      $scope.existstoggle = function (item, list,index) {
        return list.indexOf(item) > -1;
      };
    
    
    
    
    
     $scope.selectedCM = [];
     $scope.TimeListToSubmit = [];
    
      $scope.togglefood = function (item, list,index) {
          var testCM = $scope.selected;
          
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
          
      };

      $scope.existstogglefood = function (item, list,index) {
        return list.indexOf(item) > -1;
      };
    
    
    
    
    
    
    
    
    
 
    $scope.getallBusDetails = function(){
		var getallBusDetailsUrl = appService.generateURL(constants.endpoints.getallbusdetails);
	  var getallBusDetailsUrlSuccess = function(data) {
            $scope.AllBusDetails = data;
            console.log("---------" + data);
           };
	 appService.getData(getallBusDetailsUrl).then(getallBusDetailsUrlSuccess, $scope.printServiceError);
	};
    
  /*  
    $scope.pickLatLngSource1 = function($event) {
      $rootScope.showMap(function(data) {
          console.log(data);
        $scope.RbLat = data.lat;
        $scope.RbLon = data.lng;
      });
      $event.preventDefault();
    };
    
    $scope.pickLatLngDestination = function($event) {
      $rootScope.showMap(function(data) {
          console.log(data);
        $scope.RbDestLat = data.lat;
        $scope.RbDestLon = data.lng;
      });
      $event.preventDefault();
    };
    
    
    $scope.pickLatLngWayPoint = function($event) {
      $rootScope.showMap(function(data) {
          console.log(data);
        $scope.model.selected.waypoint_lat = data.lat;
        $scope.model.selected.waypoint_long = data.lng;
      });
      $event.preventDefault();
    }; 
    
    */
    
    
    
    $scope.getallBusRoute = function(){
		var getallBusRouteUrl = appService.generateURL(constants.endpoints.getallbusstops);
	  var getallBusRouteUrlSuccess = function(data) {
            $scope.AllBusStops = data;
           
            
            console.log("---------" + data);
           };
	 appService.getData(getallBusRouteUrl).then(getallBusRouteUrlSuccess, $scope.printServiceError);
	};
    
    
    /*
    $scope.selected = [];

      $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
          console.log($scope.selected);
      };

      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };
    
    */
    
    
    
    $scope.editCurrentMenu = function (contact,pprdid) {
        
        $scope.selected = pprdid.split(",");
        
        $scope.opprdid = pprdid;
        $scope.testmenu = contact.product_name;
        $scope.model.selected = angular.copy(contact);
        console.log("editCurrentMenu");
         
		var getFoodMenuForUpdateUrl = appService.generateURL(constants.endpoints.getfoodmenu);
	  var getFoodMenuForUpdateUrlSuccess = function(data) {
            $scope.foodList = data;
          
      
           };
	 appService.getData(getFoodMenuForUpdateUrl).then(getFoodMenuForUpdateUrlSuccess, $scope.printServiceError);
         
    };
    
    
    $scope.getRespectiveCategoryname = function(PrdCat){
		var getRespectiveCategorynameUrl = appService.generateURL(constants.endpoints.getfoodcategorybyid);
            getRespectiveCategorynameUrl = getRespectiveCategorynameUrl + "/" + PrdCat;
	  var getRespectiveCategorynameUrlSuccess = function(data) {
            $scope.category_name = data.category_name;
           };
	 appService.getData(getRespectiveCategorynameUrl).then(getRespectiveCategorynameUrlSuccess, $scope.printServiceError);
	};
    
    $scope.getfoodcategory = function(){
		var getfoodcategoryUrl = appService.generateURL(constants.endpoints.getfoodcategory);
	  var getfoodcategoryUrlSuccess = function(data) {
            $scope.category = data;
           };
	 appService.getData(getfoodcategoryUrl).then(getfoodcategoryUrlSuccess, $scope.printServiceError);
	};
    
   $scope.getFoodMenu = function(){
       
       if($scope.newUpdate.choice==1)
       {
        var getfoodmenuUrl = appService.generateURL(constants.endpoints.getfoodmenu);
		var getfoodmenuUrlSuccess = function(data) {
				$scope.model = {
					contacts : data,
					selected : {}
				};
				console.log($scope.model.contacts);
           };
	    appService.getData(getfoodmenuUrl).then(getfoodmenuUrlSuccess, $scope.printServiceError);
       }
       else if($scope.newUpdate.choice==2)
       {
            var getcurrentmenuUrl = appService.generateURL(constants.endpoints.getcurrentmenu);
		    var getcurrentmenuUrlSuccess = function(data) {
				$scope.model = {
					contacts : data,
					selected : {}
				};
                
                };
                
               
	 appService.getData(getcurrentmenuUrl).then(getcurrentmenuUrlSuccess, $scope.printServiceError);
       }
       
     
       else if($scope.newUpdate.choice==3)
       {
            var getallbusroutesUrl = appService.generateURL(constants.endpoints.getallbusroutes);
		    var getallbusroutesUrlSuccess = function(data) {
				$scope.model = {
					contacts : data,
					selected : {}
				};
                
                
                
                 for(var i =0; i < data.length; i++){
                   $scope.model.contacts[i].wpList = data[i].waypoint_name.split(",");
                 }
                
                for(var i =0;i < $scope.model.contacts.length;i++)
                {
                  $scope.model.contacts[i].wpList = $scope.model.contacts[i].wpList.join();
                  $scope.model.contacts[i].wpList = $scope.model.contacts[i].wpList.split(",");
                    console.log($scope.model.contacts);
                }
                
                
            };
            appService.getData(getallbusroutesUrl).then(getallbusroutesUrlSuccess, $scope.printServiceError);
	
       
        }
       
        else if($scope.newUpdate.choice==4)
        {
            var getallbusstopsUrl = appService.generateURL(constants.endpoints.getallbusstops);
		    var getallbusstopsSuccess = function(data) {
				$scope.model = {
					contacts : data,
					selected : {}
				};
                
               
            };
            appService.getData(getallbusstopsUrl).then(getallbusstopsSuccess, $scope.printServiceError);
	
       
        } 
       
        else if($scope.newUpdate.choice==5)
        {
            var getallgetallbusdetailsUrl = appService.generateURL(constants.endpoints.getallbusdetails);
		    var getallgetallbusdetailSuccess = function(data) {
				$scope.model = {
					contacts : data,
					selected : {}
				};
                
               
            };
            appService.getData(getallgetallbusdetailsUrl).then(getallgetallbusdetailSuccess, $scope.printServiceError);
	
       
        } 
   };
	//$scope.getFoodMenu();
	
	 $scope.getTemplate = function (contact) {
         
         if($scope.newUpdate.choice==1)
         {
            if (contact.product_id === $scope.model.selected.product_id) return 'FoodMenuEdit';
			else  return 'FoodMenuDisplay';  BusRouteEdit
             
         } else if($scope.newUpdate.choice==2)
         {
           if (contact.menu_id === $scope.model.selected.menu_id) return 'CurrentMenuEdit';
			else  return 'CurrentMenuDisplay'; 
             
         } else if($scope.newUpdate.choice==3)
         {
           if (contact.route_id === $scope.model.selected.route_id) return 'BusRouteEdit';
			else  return 'BusRouteDisplay';   
         }
         else if($scope.newUpdate.choice==4)
         {
           if (contact.bus_stop_id === $scope.model.selected.bus_stop_id) return 'BusStopEdit';
			else  return 'BusStopDisplay';   
         }
          else if($scope.newUpdate.choice==5)
         {
           if (contact.bus_id === $scope.model.selected.bus_id) return 'BusDetailsEdit';
			else  return 'BusDetailsDisplay';   
         }
    };
	
	 $scope.editContact = function (contact) {
        $scope.model.selected = angular.copy(contact);
        $scope.model.selected.max_qty = parseInt(contact.max_qty);
        $scope.model.selected.price = parseInt(contact.price);
        $scope.PrdList = contact.product_id;
         
         $scope.RbSourceLatLon = contact.source_latlong.split(',');
         $scope.RbLat = $scope.RbSourceLatLon[0];
         $scope.RbLon = $scope.RbSourceLatLon[1];
         
          $scope.RbDestLatLon = contact.destination_latlong.split(',');
         $scope.RbDestLat = $scope.RbDestLatLon[0];
         $scope.RbDestLon = $scope.RbDestLatLon[1];
         
         console.log($scope.RbLat);
         console.log($scope.RbLon);
         
         if($scope.newUpdate.choice == 3)
         {
         $scope.model.selected.source_name = $scope.source_name;
         }

         
         var getRespectivegetfoodmenubyidUrl = appService.generateURL(constants.endpoints.getfoodmenubyid);
            getRespectivegetfoodmenubyidUrl = getRespectivegetfoodmenubyidUrl + "/" + $scope.PrdList;
	  var getRespectivegetfoodmenubyidUrlSuccess = function(data) {
            $scope.foodId = data;
           };
	 appService.getData(getRespectivegetfoodmenubyidUrl).then(getRespectivegetfoodmenubyidUrlSuccess, $scope.printServiceError);
         
         
         
    };
    
    $scope.editContactBRD = function (contact,sorcename,sourceid,destId,waypoint,bus_id,direction,deptTime,arrivalTime) {
        $scope.model.selected = angular.copy(contact);
        
        $scope.selectedSourceName = sourceid;
      // $scope.selectedSN = $scope.model.selected.source_id;
        $scope.selectedDestinationName = destId;
        $scope.selectedBusName = bus_id;
        $scope.BusDirection = direction;
        $scope.DeptTime = deptTime;
        $scope.ArrivalTime = arrivalTime;
        
        
        $scope.selected = waypoint.split(",");
        
         if($scope.newUpdate.choice == 3)
         {
         $scope.model.selected.source_name = sorcename;
         }
        
         $scope.TotalWayPointTiming = contact.waypoint_timings.split(",");
         
    };
    
    
    
     $scope.editFoodMenu = function (contact) {
        $scope.model.selected = angular.copy(contact);
        $scope.model.selected.max_qty = parseInt(contact.max_qty);
        $scope.model.selected.price = parseInt(contact.price);
        $scope.PrdList = contact.product_id;
         
         var getRespectivegetfoodmenubyidUrl = appService.generateURL(constants.endpoints.getfoodmenubyid);
            getRespectivegetfoodmenubyidUrl = getRespectivegetfoodmenubyidUrl + "/" + $scope.PrdList;
	  var getRespectivegetfoodmenubyidUrlSuccess = function(data) {
            $scope.foodId = data;
           };
	 appService.getData(getRespectivegetfoodmenubyidUrl).then(getRespectivegetfoodmenubyidUrlSuccess, $scope.printServiceError);
         
         
         
    };
    
     $scope.editBusDetails = function (contact,bus_id,bus_name,bus_type,route_number,operating_days) {
        $scope.model.selected = angular.copy(contact);
         
    };
    
     
    
    
    
     $scope.reset = function () {
        $scope.model.selected = {};
    };
	
    
    
     $scope.UpdateFoodMenu = function($event,prdId,Prdcat,index) {
         console.log(prdId);
         console.log(Prdcat);
		var UpdateFoodMenuUrl = appService.generateURL(constants.endpoints.updatefoodmenu);
		$http({
			method: 'POST',
			url: UpdateFoodMenuUrl,
			data: $httpParamSerializerJQLike({
                "product_id" : prdId,
                "product_name" : $scope.model.selected.product_name,
                "product_category" : Prdcat,
                "category_name" : $scope.model.selected.category_name,
                "max_qty" : $scope.model.selected.max_qty,
                "product_price" : $scope.model.selected.price
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
					//$rootScope.showAlert("Updated Successfully", constants.alertTypes.notification);
					$rootScope.showAlert(result.data.message, constants.alertTypes.notification);
                    $scope.getFoodMenu();
				}, function(error) {
					console.log(error);
                    $rootScope.showAlert(result.data.message, constants.alertTypes.notification);
					});

		 $event.preventDefault();   
    };
    
    
    $scope.UpdateCurrentMenu = function($event,menuId,productId,opprdid,index) {
        console.log(opprdid);
        var tests = $scope.selected;
        
        /* if($scope.testmenu == null){
         $scope.bool = 1;
        $rootScope.showAlert("Please select any food item", constants.alertTypes.warning);
         } */
        
        if($scope.selected == null || $scope.selected == ""){
        $rootScope.showAlert("Please select any food item", constants.alertTypes.warning);
         }
        /*
        console.log($scope.user.tkId);
        if($scope.user.tkId == null || $scope.user.tkId == ""){
          var allPrdId = opprdid;
        }else
        var allPrdId = $scope.user.tkId.join();
      */
        
        var allPrdId = $scope.selected.join();
		var UpdateCurrentMenuUrl = appService.generateURL(constants.endpoints.updatecurrentmenu);
		$http({
			method: 'POST',
			url: UpdateCurrentMenuUrl,
			data: $httpParamSerializerJQLike({
                "menu_id" : menuId,
                "menu_name" : $scope.model.selected.menu_name,
                "product_id" : allPrdId
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
					$rootScope.showAlert(result.data.message, constants.alertTypes.notification);
                    $scope.getFoodMenu();
                    $scope.user.tkId = "";
				}, function(error) {
					console.log(error);
                    $rootScope.showAlert(result.data.message, constants.alertTypes.notification);
					});

		 //$event.preventDefault();   
    };
    
    
    $scope.UpdateBusDetails = function($event,busId,busName,busNumber,routeNumber,busType,OperatingDays,index) {
      
		var UpdateBusDetailsUrl = appService.generateURL(constants.endpoints.updatebusdetails);
		$http({
			method: 'POST',
			url: UpdateBusDetailsUrl,
			data: $httpParamSerializerJQLike({
                "bus_id" : busId,
                "bus_name" : busName,
                "bus_number" : busNumber,
                "route_number" : routeNumber,
                "bus_type" : busType,
                "operating_days" : OperatingDays
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
					$rootScope.showAlert(result.data.message, constants.alertTypes.notification);
                    $scope.getFoodMenu();
				}, function(error) {
                    $rootScope.showAlert(result.data.message, constants.alertTypes.notification);
					console.log(error);
					});

		 $event.preventDefault();   
    };
       
    /*   
    $scope.DeleteFoodMenu = function($event,prdId,PrdName,index) {
         console.log(prdId);
         console.log(PrdName);
		var DeleteFoodMenuUrl = appService.generateURL(constants.endpoints.deletefoodmenu);
		$http({
			method: 'POST',
			url: DeleteFoodMenuUrl,
			data: $httpParamSerializerJQLike({
                "product_id" : prdId,
                "product_name" : PrdName
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
                    var node = document.getElementById(index);
                    node.remove();
					$rootScope.showAlert("Deleted Successfully", constants.alertTypes.notification);
                    $scope.getFoodMenu();
				}, function(error) {
					console.log(error);
					});

		 $event.preventDefault();
    };
    */
    
    $scope.DeleteFoodMenu = function(ev,PrdId,Prdname,index)
    {
        var confirm = $mdDialog.confirm()
          .title('Are you sure , to delete')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Confirm')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function()
       {
            //$scope.status = 'confirm';
           // alert("Confirm");
            
		var DeleteFoodMenuUrl = appService.generateURL(constants.endpoints.deletefoodmenu);
		$http({
			method: 'POST',
			url: DeleteFoodMenuUrl,
			data: $httpParamSerializerJQLike({
                "product_id" : PrdId,
                "product_name" : Prdname
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
                    var node = document.getElementById(index);
                    node.remove();
					$rootScope.showAlert(result.data.message, constants.alertTypes.notification);
                    $scope.getFoodMenu();
				}, function(error) {
					$rootScope.showAlert(result.data.message, constants.alertTypes.error);
					});

		 $event.preventDefault();
      
            
        }, function() {
            });
   };


    $scope.call = function(){
    alert($scope.datarepeatSelect);
    };
           
       $scope.UpdateBusRoute = function($event,routeId,SourceId,destinationId,waypoint,bus_id,BusDirection,index) {
           
           if($scope.SourceIdToUpload == null | $scope.SourceIdToUpload == "")
           {
             $scope.SourceIdToUpload = SourceId;
           }
           
           if($scope.DestinationIdToUpload == null | $scope.DestinationIdToUpload == "")
           {
             $scope.DestinationIdToUpload = destinationId;
           }
           
           if($scope.BusIdToUpload == null | $scope.BusIdToUpload == "")
           {
             $scope.BusIdToUpload = bus_id;
           }
           
           
           
           
           for (var i = 1; i < $scope.TotalWayPointTiming.length-1; i++) {
            if($scope.TotalWayPointTiming[i] == null || $scope.TotalWayPointTiming[i] == "")
            {
                $scope.TotalWayPointTiming.splice(i,0);
            }
            else{
                    //$scope.TimeListToSubmit[i] = $scope.TotalWayPointTiming[i].toString().substring(16,24);
                    $scope.TimeListToSubmit[i] = $scope.TotalWayPointTiming[i];
                }
            }
           
           
           /*
            if($scope.TimeListToSubmit.join() == null | $scope.TimeListToSubmit.join() == "")
           {
             $scope.TimeListToSubmit = $scope.TotalWayPointTiming.join();
           }
           
           */
           
           console.log($scope.selectedSourceName);
           if($scope.selected == null || $scope.selected.length == 0){
              $rootScope.showAlert("Please select any waypoints", constants.alertTypes.warning);
         } else{ 
             var allPrdId = $scope.selected.join();
             alert(allPrdId);
         }
           
           console.log($scope.TotalWayPointTiming);
           var twp = $scope.TotalWayPointTiming.join();

           $scope.removeFlmnt = $scope.selected.shift(); 
           var removeLlmnt = $scope.selected.pop();
           
		var UpdateBusRouteUrl = appService.generateURL(constants.endpoints.updatebusroute);
		$http({
			method: 'POST',
			url: UpdateBusRouteUrl,
			data: $httpParamSerializerJQLike({
                "route_id" : routeId,
                "route_name" : $scope.model.selected.route_name,
                "route_number" : $scope.model.selected.route_number,
                "source_id" : $scope.SourceIdToUpload,
                "destination_id" : $scope.DestinationIdToUpload,
                //"waypoint" : allPrdId,
                "waypoint" : $scope.selected.join(),
                "bus_id" : $scope.BusIdToUpload,
                "departure_time" : $scope.DeptTime,
                "arrival_time" : $scope.ArrivalTime,
                //"waypoint_timings" : twp,
                "waypoint_timings" : $scope.TimeListToSubmit.join().substring(1),  
                "direction" : BusDirection
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
					$rootScope.showAlert(result.data, constants.alertTypes.notification);
                    $scope.getFoodMenu();
				}, function(error) {
					console.log(error);
                    $rootScope.showAlert(result.data, constants.alertTypes.notification);
					});

		 $event.preventDefault();   
    };
       
       
       
    
     
    /*
    $scope.DeleteBusRoute = function($event,routeId,index) {
         console.log(routeId);
		var DeleteBusRouteUrl = appService.generateURL(constants.endpoints.deletebusroute);
		$http({
			method: 'POST',
			url: DeleteBusRouteUrl,
			data: $httpParamSerializerJQLike({
                "route_id" : routeId
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
                    var node = document.getElementById(index);
                    node.remove();
					$rootScope.showAlert("Deleted Successfully", constants.alertTypes.notification);
                    $scope.getFoodMenu();
				}, function(error) {
					console.log(error);
					});

		 $event.preventDefault();
    };
    
    */
     $scope.DeleteBusRoute = function(ev,routeId,index)
    {
        var confirm = $mdDialog.confirm()
          .title('Are you sure , to delete')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Confirm')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function()
       {
            //$scope.status = 'confirm';
           // alert("Confirm");
            
		var DeleteBusRouteUrl = appService.generateURL(constants.endpoints.deletebusroute);
		$http({
			method: 'POST',
			url: DeleteBusRouteUrl,
			data: $httpParamSerializerJQLike({
                "route_id" : routeId
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
                    var node = document.getElementById(index);
                    node.remove();
					$rootScope.showAlert(result.data.message, constants.alertTypes.notification);
                    $scope.getFoodMenu();
				}, function(error) {
					$rootScope.showAlert(result.data.message, constants.alertTypes.error);
					});

		 $event.preventDefault();
      
            
        }, function() {
            });
   };
    
    
    
    $scope.DeleteBusDetails = function(ev,BusId,BusName,index)
    {
        var confirm = $mdDialog.confirm()
          .title('Are you sure , to delete')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Confirm')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function()
       {
            //$scope.status = 'confirm';
           // alert("Confirm");
            
		var DeleteBusDetailsUrl = appService.generateURL(constants.endpoints.deletebusdetails);
		$http({
			method: 'POST',
			url: DeleteBusDetailsUrl,
			data: $httpParamSerializerJQLike({
                "bus_id" : BusId,
                "bus_name" : BusName
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
                    var node = document.getElementById(index);
                    node.remove();
					$rootScope.showAlert(result.data.message, constants.alertTypes.notification);
                    $scope.getFoodMenu();
				}, function(error) {
					$rootScope.showAlert(result.data.message, constants.alertTypes.error);
					});

		 $event.preventDefault();
      
            
        }, function() {
            });
   };
    
    /*
    $scope.DeleteCurrentMenu = function($event,menuId,menuName,index)
    {
        console.log("DeleteCurrentMenu");
		var DeleteCurrentMenuUrl = appService.generateURL(constants.endpoints.deletecurrentmenu);
		$http({
			method: 'POST',
			url: DeleteCurrentMenuUrl,
			data: $httpParamSerializerJQLike({
                "menu_id" : menuId,
                "menu_name" : menuName,
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
                    var node = document.getElementById(index);
                    node.remove();
					$rootScope.showAlert("Deleted Successfully", constants.alertTypes.notification);
                    $scope.getFoodMenu();
                    $rootScope.callgetcurrentmenu();
				}, function(error) {
					console.log(error);
					});
        $event.preventDefault();
    };
    */
    
    
    $scope.DeleteCurrentMenu = function(ev,menuId,menuName,index)
    {
        var confirm = $mdDialog.confirm()
          .title('Are you sure , to delete')
          .content('')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Confirm')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function()
       {
            //$scope.status = 'confirm';
           // alert("Confirm");
            
		var DeleteCurrentMenuUrl = appService.generateURL(constants.endpoints.deletecurrentmenu);
		$http({
			method: 'POST',
			url: DeleteCurrentMenuUrl,
			data: $httpParamSerializerJQLike({
                "menu_id" : menuId,
                "menu_name" : menuName,
            }),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}}).then(function(result) {
                    var node = document.getElementById(index);
                    node.remove();
					$rootScope.showAlert(result.data.message, constants.alertTypes.notification);
                    $scope.getFoodMenu();
                    $rootScope.callgetcurrentmenu();
				}, function(error) {
					$rootScope.showAlert(result.data.message, constants.alertTypes.error);
					});

		 $event.preventDefault();
      
            
        }, function() {
            });
   };

 
});



