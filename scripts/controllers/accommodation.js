/**
 * @ngdoc function
 * @name tourismApp.controller:AccommodationCtrl
 * @description
 * # AccommodationCtrl
 * Controller of the tourismApp
 */
angular.module('tourismApp')
  .controller('AccommodationCtrl', function($scope, $rootScope, S3Uploader, appService, constants, $timeout) {
    'use strict';

    var resetForm = function() {
      $scope.newAccomodation = {
        "name": "",
        "cluster": "",
        "selectedPrice": "",
        "phone": "",
        "latitude": "",
        "longitude": "",
        "description": "",
        "address": "",
        "extraInfo": "",
        "videoUrl": "",
        "audioUrl": "",
      };
      $scope.sliderImages = [];
      $scope.thumbnail = {};
    }

    resetForm();

    var sliderImagesS3Url = [];
    /*---------------------------------------------------------------------------------------*/
    $scope.pickLatLng = function($event) {
      $rootScope.showMap(function(data) {
        $scope.newAccomodation.latitude = data.lat;
        $scope.newAccomodation.longitude = data.lng;
      });
      $event.preventDefault();
    };
    /*---------------------------------------------------------------------------------------*/

    /*  getCountries service  */
    var getCountriesUrl = appService.generateURL(constants.endpoints.getCountryList)

    var getCountriesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.countries = data.response.countries;
      }
    };

    appService.getData(getCountriesUrl).then(getCountriesSuccess, $scope.printServiceError);
    /*---------------------------------------------------------------------------------------*/

    /* getStatess service*/
    var getStatesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.states = data.response.states;
      }
    };

    $scope.getRespectiveStates = function() {
      $scope.getStates($scope.newAccomodation.country, getStatesSuccess);
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
      getClustersUrl += '?cityId=' + $scope.newAccomodation.city;
      appService.getData(getClustersUrl).then(getClustersSuccess, $scope.serviceErrorHandler);
    };

    /* getCities service*/
    var getCitiesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.cities = data.response.cities;
      }
    };

    $scope.getRespectiveCities = function() {
      $scope.getCities($scope.newAccomodation.state, getCitiesSuccess);
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


    /*  getStarCategory service  */
    var getstarCategoryUrl = appService.generateURL(constants.endpoints.getStarCategory)

    var getStarCategorySuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.StarCategory = data.response.stars;
      }
    };

    appService.getData(getstarCategoryUrl).then(getStarCategorySuccess, $scope.printServiceError);
    /*---------------------------------------------------------------------------------------*/

    /*  getStarCategory service  */
    var getRoomTypesUrl = appService.generateURL(constants.endpoints.getRoomTypes)

    var getRoomTypesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.RoomTypes = data.response;
      }
    };

    appService.getData(getRoomTypesUrl).then(getRoomTypesSuccess, $scope.printServiceError);
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

    $scope.showFirstForm = function(clearValues, $event) {
      $scope.currentSectionIndex = 0;
      if (clearValues) {
        $scope.submitAccomodation($event);
        $timeout(resetForm, 500);
      }
      $scope.currentSectionIndex = 0;
      $event.preventDefault();
    };

    $scope.showNextForm = function($event) {
      $scope.currentSectionIndex += 1;

      $event.preventDefault();
    };

    /*------------------------------------------------------------------------------------------------------------------*/
    /*success callback for submitting Accomodation*/
    var addAccommodationSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.showAlert(data.status.message, constants.alertTypes.notification);
      }
    };
    /*use this method to submit the ACCOMODATION form data to server*/
    $scope.submitAccomodation = function($event) {
      uploadSliderImages();
      uploadThumbnail();

      /*use this array of urls of slider images for sending in payload*/
      // $scope.console(sliderImagesS3Url);
      var imagesPayload = [];
      angular.forEach($scope.sliderImages, function(file) {
        var imgObj = {};
        imgObj.url = file.destUrl;
        imgObj.description = file.desc;
        imagesPayload.push(imgObj);
      });

      var payload = {
        "name": $scope.newAccomodation.name,
        "cluster": $scope.newAccomodation.cluster,
        "type": 2,
        "priceRange": $scope.newAccomodation.selectedPrice,
        "rank": $scope.newAccomodation.rank,
        "latitude": $scope.newAccomodation.latitude,
        "longitude": $scope.newAccomodation.longitude,
        "description": $scope.newAccomodation.description,
        "contactNumber": $scope.newAccomodation.phone,
        "contactName": $scope.newAccomodation.contactName,
        "contactAddress": $scope.newAccomodation.address,
        "extraInfo": $scope.newAccomodation.extraInfo,
        "star": $scope.newAccomoscopedation.starCategory,
        "roomType": $scope.newAccomodation.RoomTypes,
        "facilities": $scope.newAccomodation.Facilities,
        "video": $scope.newAccomodation.videoUrl,
        "audio": $scope.newAccomodation.audioUrl,
        "contactThumbnail": $scope.thumbnail.destUrl,
        "images": imagesPayload
      }

      var addAccomodationUrl = appService.generateURL(constants.endpoints.addAccommodation);
      appService.updateData(addAccomodationUrl, payload).then(addAccommodationSuccess, $scope.serviceErrorHandler);
      $event.preventDefault();
    };
  });
