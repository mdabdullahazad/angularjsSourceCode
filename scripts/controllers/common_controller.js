/**
 * @ngdoc function
 * @name tourismApp.controller:CommonCtrl
 * @description
 * # CommonCtrl
 * Controller of the tourismApp
 */
angular.module('tourismApp').controller('CommonCtrl', function($scope, $rootScope, $mdToast, $state, constants, ngSessionStore, appService) {
  'use strict';

  var getCountriesUrl = appService.generateURL(constants.endpoints.getCountryList);
  $scope.showModal = false;
  $scope.showToast = false;

  $rootScope.sliderImageWidth = constants.general.sliderImageWidth;
  $rootScope.sliderImageHeight = constants.general.sliderImageHeight;
  var toastPosition = {
    bottom: false,
    top: true,
    left: false,
    right: true
  };

  var getToastPosition = function() {
    return Object.keys(toastPosition)
      .filter(function(pos) {
        return toastPosition[pos];
      })
      .join(' ');
  };

  $scope.showToast = function(message) {
    $scope.displayToast = true;

    var toast = $mdToast.simple()
      .content(message)
      .action('OK')
      .highlightAction(true)
      .position(getToastPosition());
    $mdToast.show(toast).then(function() {
      $scope.displayToast = false;
    });
  };

  //  $scope.showToast(constants.alerts.uploadPromise);
  /*use this method to show alert from any part of the app*/
  $rootScope.showAlert = function(msg, type) {
    $rootScope.modal = {
      'title': 'Alert',
      'message': msg,
      'type': constants.modalTypes.alert,
      'alertType': type
    };
    $scope.showModal = true;
  };

  $rootScope.showPopup = function(title, msg, type, contentUrl) {
    $rootScope.modal = {
      'title': title,
      'type': constants.modalTypes.popup,
      'contentUrl': contentUrl
    };
    $scope.showModal = true;
  };

  $rootScope.showMap = function(callback) {
    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      events: {
        "click": function(mapModel, eventName, originalEventArgs) {
          if (originalEventArgs != null && originalEventArgs.length) {
            var receivedCoordinates = originalEventArgs[0];
            if (receivedCoordinates != null) {
              var retVal = {};
              if (receivedCoordinates.hasOwnProperty('latLng')) {
                retVal.lat = receivedCoordinates.latLng.A;
                retVal.lng = receivedCoordinates.latLng.F;
                callback(retVal)
              }
            }
          }
        }
      },
      zoom: 8
    };
    $rootScope.modal = {
      'title': constants.alerts.mapsTitle,
      'type': constants.modalTypes.map,
      'alertType': constants.alertTypes.default
    };
    $scope.showModal = true;
  };

  $scope.closeModal = function() {
    $scope.showModal = false;
  };

  $scope.$on('onRejectedImagesFound', function(event, args) {
    if (args.rejectedImages.length) {
      var alertText = constants.alerts.rejectedImages + "\n" + args.rejectedImages.toString();
      $scope.showToast(alertText);
    }
  });

  /*call the service initially to get the countries list*/
  $scope.getCountries = function() {
    if (angular.isUndefined($rootScope.countries) || $rootScope.countries === null) {
      appService.getData(getCountriesUrl).then(getCountriesSuccess, $scope.printServiceError);
    }
  };

  /*use this method to get the states list for a respective country*/
  $scope.getStates = function(countryId, successCallback) {
    var getStatesUrl = appService.generateURL(constants.endpoints.getStateList);

    getStatesUrl += '?countryId=' + countryId;
    appService.getData(getStatesUrl).then(successCallback, $scope.serviceErrorHandler);
  };

  /*use this method to get the cities list for a respective state*/
  $scope.getCities = function(stateId, successCallback) {
    var getCitiesUrl = appService.generateURL(constants.endpoints.getCityList);

    getCitiesUrl += '?stateId=' + stateId;
    appService.getData(getCitiesUrl).then(successCallback, $scope.serviceErrorHandler);
  };

  /*success callback for getCountries service*/
  var getCountriesSuccess = function(data) {
    if ($scope.isResponseAvailable(data)) {
      $scope.countries = data.response.countries;
    }
  };

  /*use this method to check if the service response has data in it
    if not, show error alert*/
  $scope.isResponseAvailable = function(result) {
    if (result.hasOwnProperty('response') && result.response !== null) {
      return true;
    }

    if (result.hasOwnProperty('status') && result.status.hasOwnProperty('message')) {
      $rootScope.showAlert(result.status.message, constants.alertTypes.error);
    } else {
      $rootScope.showAlert(constants.alerts.noData, constants.alertTypes.error);
    }

    return false;
  };

  /*use this method to handle the error callback of any service within the app*/
  $scope.serviceErrorHandler = function(result) {
    if (result.hasOwnProperty('status') && result.status !== undefined && result.status.hasOwnProperty('message')) {
      $rootScope.showAlert(result.status.message, constants.alertTypes.error);
    } else {
      $rootScope.showAlert(constants.alerts.generalError, constants.alertTypes.error);
    }
  };

  $scope.getUniqueString = function() {
    var text = "";
    var possible = constants.s3Info.randomString;

    for (var i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  $scope.getS3AssetUrl = function(fileName) {
    return "https://s3-" + constants.s3Info.region + ".amazonaws.com/" + constants.s3Info.bucket + "/" + fileName; 
	
	
  };

  $scope.getImageDimensions = function(imageFile, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var image = new Image();

      image.onload = function() {
        var dimensions = {};
        dimensions.width = this.width;
        dimensions.height = this.height;

        return callback(dimensions);
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  $rootScope.logoutUser = function() {
    ngSessionStore.clearAll();
    $state.go("login");
  };

  $scope.printServiceError = function(result) {
    if (result.hasOwnProperty("response")) {
      console.error(result.response.status.message);
      return;
    }
    console.error(result.status.message);
  };

  $rootScope.console = function(msg) {
    console.log(msg);
  };
});
