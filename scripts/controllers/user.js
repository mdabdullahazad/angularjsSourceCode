/**
 * @ngdoc function
 * @name tourismApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the tourismApp
 */  
angular.module('tourismApp')
  .controller('UserCtrl', function ($scope, appService, constants) {
    'use strict';
    
    var registerCmsUserSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.showAlert(data.status.message, constants.alertTypes.notification);
      }
    };
 
 /*use this method to register user form data to server*/
    $scope.registerCmsUser = function($event) {
     
	 var payload = {
        "userEmail": $scope.credentials.userEmail,
        "userPassword": $scope.credentials.password,
      }

      var registerCmsUserUrl = appService.generateURL(constants.endpoints.registerCmsUser);
      appService.postData(registerCmsUserUrl, payload).then(registerCmsUserSuccess, $scope.serviceErrorHandler);
      $event.preventDefault();
    };
    
  });
