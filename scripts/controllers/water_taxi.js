/**
 * @ngdoc function
 * @name tourismApp.controller:WaterTaxiCtrl
 * @description
 * # WaterTaxiCtrl
 * Controller of the tourismApp
 */
angular.module('tourismApp')
  .controller('WaterTaxiCtrl', function($scope, $rootScope, S3Uploader, appService, constants) {
    'use strict';

    var sliderImagesS3Url = [];
    $scope.newWaterTaxi = {};
    $scope.newWaterTaxi.latitude = "";
    $scope.newWaterTaxi.longitude = "";
    /*---------------------------------------------------------------------------------------*/
    $scope.pickLatLng = function($event) {
      $rootScope.showMap(function(data) {
        $scope.newWaterTaxi.latitude = data.lat;
        $scope.newWaterTaxi.longitude = data.lng;
      });
      $event.preventDefault();
    };

    /*---------------------------------------------------------------------------------------*/
    /* getPoiTypesSuccess service*/
    var getPoiTypesUrl = appService.generateURL(constants.endpoints.getPoiTypes);

    var getPoiTypesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.PoiTypes = data.response;
      }
    };

    appService.getData(getPoiTypesUrl).then(getPoiTypesSuccess, $scope.serviceErrorHandler);


    /*---------------------------------------------------------------------------------------*

    /* getStatess service*/
    var getStatesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.states = data.response.states;
      }
    };

    $scope.getRespectiveStates = function() {
      $scope.getStates($scope.waterTaxi.country, getStatesSuccess);
    };

    /* getCities service*/
    var getCitiesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.cities = data.response.cities;
      }
    };

    $scope.getRespectiveCities = function() {
      $scope.getCities($scope.waterTaxi.state, getCitiesSuccess);
    };

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
      getClustersUrl += '?cityId=' + $scope.waterTaxi.city;
      appService.getData(getClustersUrl).then(getClustersSuccess, $scope.serviceErrorHandler);
    };
    /*---------------------------------------------------------------------------------------

/* getTimeslots service*/
    var getTimeslotsUrl = appService.generateURL(constants.endpoints.getTimeslots);


    var getTimeslotsSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.Timeslots = data.response;
      }
    };

    appService.getData(getTimeslotsUrl).then(getTimeslotsSuccess, $scope.serviceErrorHandler);

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

    $scope.addCluster = function() {
      var payload = {};
      payload.cityId = $scope.cluster.city;
      payload.clusterName = $scope.cluster.name;
      payload.clusterLocation = "";

      var addClusterUrl = appService.generateURL(constants.endpoints.addCluster);
      appService.updateData(addClusterUrl, payload).then(addClusterSuccess, $scope.serviceErrorHandler);
      $event.preventDefault();
    };


    var addClusterSuccess = function(data) {
      $rootScope.showAlert(data.status.message, constants.alertTypes.notification);
      if ($scope.clusters == null) {
        $scope.clusters = [];
      }
      $scope.clusters.push(data.response);
    };

    /*---------------------------------------------------------------------------------------*/

    $scope.thumbnail = {
      "fileName": "",
      "src": ""
    };
    $scope.sliderImages = [];
    $scope.currentSectionIndex = 0;

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
    /*------------------------------------------------------------------------------------------------------------------*/
    /*success callback for submitting Accomodation*/
    var addWaterTaxiSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.showAlert(data.status.message, constants.alertTypes.notification);
      }
    };
    /*use this method to submit the ACCOMODATION form data to server*/
    $scope.submitWaterTaxi = function($event) {
      uploadSliderImages();
      uploadThumbnail();

      /*use this array of urls of slider images for sending in payload*/

      var imagesPayload = [];
      angular.forEach($scope.sliderImages, function(file) {
        var imgObj = {};
        imgObj.url = file.destUrl;;
        imgObj.description = file.desc;
        imagesPayload.push(imgObj);
      });

      var payload = {
        "name": $scope.newWaterTaxi.name,
        "cluster": $scope.newWaterTaxi.cluster,
        "timeslot": $scope.selectedTimeslot,
        "timeToSpend": $scope.waterTaxi.selectedHours,
        "type": 2,
        "priceRange": $scope.newWaterTaxi.selectedPrice,
        "rank": $scope.newWaterTaxi.selectedPriority,
        "latitude": $scope.newWaterTaxi.latitude,
        "longitude": $scope.newWaterTaxi.longitude,
        "description": $scope.newWaterTaxi.description, 
        "contactNumber": $scope.newWaterTaxi.phone,
        "contactName": $scope.newWaterTaxi.contactName,
        "contactAddress": $scope.newWaterTaxi.address,
        "extraInfo": $scope.newWaterTaxi.extraInfo,
        "video": $scope.newWaterTaxi.videoUrl,
        "audio": $scope.newWaterTaxi.audioUrl,  
        "contactThumbnail": $scope.thumbnail.destUrl,
        "images": imagesPayload
      }

      var addWaterTaxiUrl = appService.generateURL(constants.endpoints.addWaterTaxi);
      appService.updateData(addWaterTaxiUrl, payload).then(addWaterTaxiSuccess, $scope.serviceErrorHandler);
      $event.preventDefault();
    };
  });
