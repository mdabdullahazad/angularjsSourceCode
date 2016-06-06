/**
 * @ngdoc function
 * @name tourismApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the tourismApp
 */
angular.module('tourismApp')
  .controller('LoginCtrl', function($scope, $rootScope, $state, appService, ngSessionStore, constants, md5) {
    'use strict';

    $scope.credentials = {
      "username": "admin@tourism.com",
      "password": "helloworld"
    };

    /*use this method to get the form values and pass it to the server for authentication*/
    $scope.login = function() {
      var hashedPwd = md5.createHash($scope.credentials.password);
      var payload = {};
      payload.userEmail = $scope.credentials.username;
      payload.userPassword = hashedPwd;

      var loginUrl = appService.generateURL(constants.endpoints.login);
      appService.postData(loginUrl, payload).then(loginSuccess, $scope.serviceErrorHandler);
      //            $state.go("dashboard"); //temporary bypassing. uncomment the above line and comment this line for actual processing
    };

    /*success callback for login service. Pass the user to next screen after successfull login*/
    var loginSuccess = function(result) {
      if ($scope.isResponseAvailable(result)) {
        var token = result.response;
        if (token !== null && token.hasOwnProperty('userToken')) {
          ngSessionStore.save('userToken', token.userToken);
          ngSessionStore.save('tokenExpiry', token.expiresIn);

          $state.go("dashboard");
        } else {
          $scope.showAlert(constants.alerts.noData, constants.alertTypes.error);
        }
      }
    };
  });
