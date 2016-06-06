/**
 * @ngdoc function
 * @name tourismApp.controller:PoiCtrl
 * @description
 * # PoiCtrl
 * Controller of the tourismApp
 */
angular.module('tourismApp')
  .controller('PoiCtrl', function($scope, $rootScope, appService, constants, S3Uploader) {
    'use strict';

    var sliderImagesS3Url = [];
    var getPoiTypesUrl = appService.generateURL(constants.endpoints.getPoiTypes);
    var getPoiTimeSlotsUrl = appService.generateURL(constants.endpoints.getTimeslots);
    $scope.newPoi = {};
    $scope.newPoi.latitude = 0;
    $scope.newPoi.longitude = 0;
    $scope.getCountries();

    /*---------------------------------------------------------------------------------------*/
    /* getPoiTypesSuccess callback*/
    var getPoiTypesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.poiTypes = data.response.poiType;
      }
    };

    /* getPoiTimeslotSuccess callback*/
    var getPoiTimeslotSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.poiTimeslots = data.response;
      }
    };

    // get PoiTypes and PoiTimeSlots
    appService.getData(getPoiTypesUrl).then(getPoiTypesSuccess, $scope.serviceErrorHandler);
    appService.getData(getPoiTimeSlotsUrl).then(getPoiTimeslotSuccess, $scope.serviceErrorHandler);

    /*---------------------------------------------------------------------------------------*/

    /* getStatess service*/
    var getStatesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.states = data.response.states;
      }
    };

    $scope.getRespectiveStates = function() {
      $scope.getStates($scope.newPoi.country, getStatesSuccess);
    };

    /*---------------------------------------------------------------------------------------*/

    /* getCities service*/
    var getCitiesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.cities = data.response.cities;
      }
    };

    $scope.getRespectiveCities = function() {
      $scope.getCities($scope.newPoi.state, getCitiesSuccess);
    };

    /*---------------------------------------------------------------------------------------*/
    /* getTimeslots service*/
    var getTimeslotsSuccess = function(data) {
      if ($scope.isResponseAvailable(data))
        $scope.Timeslots = data.response.Timeslots;
    }


    // code for getTimeslots
    $scope.getRespectiveTimeslots = function() {
      var getTimeslotsUrl = appService.generateURL(constants.endpoints.getTimeslots);
      appService.getData(getTimeslotsUrl).then(getTimeslotsSuccess, $scope.serviceErrorHandler);
    };

    /*---------------------------------------------------------------------------------------*/
    
     /* getPoiPriceRanges service*/
    var getPriceRangesUrl = appService.generateURL(constants.endpoints.getPoiPriceRanges);

    var getPoiPriceRangesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.PriceRanges = data.response;
      }
    };

    appService.getData(getPriceRangesUrl).then(getPoiPriceRangesSuccess, $scope.serviceErrorHandler);
    /*---------------------------------------------------------------------------------------*/
    /*  getClusters service*/
    $scope.cluster = {
      'country': '',
      'city': '',
      'name': ''
    };

    var getClustersSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.clusters = data.response.clusters;
      }
    };

    $scope.getRespectiveClusters = function() {
      var getClustersUrl = appService.generateURL(constants.endpoints.getClusterList);
      getClustersUrl += '?cityId=' + $scope.newPoi.city;
      appService.getData(getClustersUrl).then(getClustersSuccess, $scope.serviceErrorHandler);
    };
    /*---------------------------------------------------------------------------------------*/


    $scope.thumbnail = {
      "fileName": "",
      "src": ""
    };
    $scope.sliderImages = [];

    $scope.setThumbnail = function(element) {
      var files = element.files;
      if (files[0] != undefined && files[0] != null) {
        var file = files[0];
        file.uniqueFileName = $scope.getUniqueString() + '-' + file.name;
        file.srcUrl = URL.createObjectURL(file);
        file.destUrl = $scope.getS3AssetUrl(file.uniqueFileName);
        $scope.thumbnail = file;
        $scope.$apply();
      }
    };

    $scope.setSliderImage = function(element) {
      var files = element.files;
      var rejectedImages = [];
      var resultCount = 0;

      if (files != undefined && files != null) {
        angular.forEach(files, function(file) {
          file.uniqueFileName = $scope.getUniqueString() + '-' + file.name;
          file.srcUrl = URL.createObjectURL(file)
          file.destUrl = $scope.getS3AssetUrl(file.uniqueFileName);

          $scope.getImageDimensions(file, function(dimensions) {
            ++resultCount;

            if (dimensions.width == $rootScope.sliderImageWidth && 
              dimensions.height == $rootScope.sliderImageHeight) {
              $scope.sliderImages.push(file);
            } else {
              rejectedImages.push(file.name);
            }

            if (resultCount === files.length && rejectedImages.length > 0) {
              $rootScope.$broadcast('onRejectedImagesFound', {
                "rejectedImages": rejectedImages
              });
            }
            $scope.$apply();
          });
        });
      }
    };

    var uploadSliderImages = function() {
      var total_image = $scope.sliderImages.length;

      for (var i = 0; i < total_image; i++) {
        S3Uploader.upload($scope.sliderImages[i]);
      }
    };

    var uploadThumbnail = function() {
      S3Uploader.upload($scope.thumbnail);
    };

    $scope.removeThumbnail = function() {
      $scope.thumbnail = {
        "fileName": "",
        "src": ""
      };
    };

    $scope.removeSliderImage = function(index) {
      $scope.sliderImages.splice(index, 1);
    };

    $scope.pickLatLng = function($event) {
      $rootScope.showMap(function(data) {
        $scope.newPoi.latitude = data.lat;
        $scope.newPoi.longitude = data.lng;
      });
      $event.preventDefault();
    };

    /*success callback for submitting POI*/
    var addPoiSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.showAlert(data.status.message, constants.alertTypes.notification);
        var poi = data.response.poi;
      }
    };

    /*use this method to submit the POI form data to server*/
    $scope.submitPoi = function($event) {
      uploadSliderImages();
      uploadThumbnail();

      /*use this array of urls of slider images for sending in payload*/
      var imagesPayload = [];
      angular.forEach($scope.sliderImages, function(file) {
        var imgObj = {};
        imgObj.url = file.destUrl;
        imgObj.description = file.desc;
        imagesPayload.push(imgObj);
      });

      if (imagesPayload.length) {
        $scope.showToast(constants.alerts.uploadPromise);
      }

      var payload = {
        "name": $scope.newPoi.name,
        "cluster": $scope.newPoi.cluster,
        "timeslot": $scope.selectedTimeslot,
        "timeToSpend": $scope.selectedHours,
        "type": $scope.selectedPoiType,
        "priceRange": $scope.newPoi.selectedPrice,
        "rank": $scope.selectedPriority,
        "latitude": $scope.newPoi.latitude,
        "longitude": $scope.newPoi.longitude,
        "description": $scope.newPoi.description,
        "contactNumber": $scope.newPoi.phone,
        "contactName": $scope.newPoi.contactName,
        "contactAddress": $scope.newPoi.address,
        "extraInfo": $scope.newPoi.extraInfo,
        "video": $scope.newPoi.videoUrl,
        "audio": $scope.newPoi.audioUrl,
        "images": imagesPayload
      }

      var addPoiUrl = appService.generateURL(constants.endpoints.addPoi);
      appService.updateData(addPoiUrl, payload).then(addPoiSuccess, $scope.serviceErrorHandler);
      $event.preventDefault();
    };
  });
