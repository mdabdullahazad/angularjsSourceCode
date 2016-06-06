/**
 * @ngdoc function
 * @name tourismApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the tourismApp
 */
angular.module('tourismApp')
  .controller('EventsCtrl', function($scope, $rootScope, appService, constants) {
    'use strict';

    $scope.getCountries();
    $scope.trigger = [];
    var i;

    for (i = 1; i <= 10; i++) {
      var triggerItem = {};
      triggerItem.label = "Before " + i + " Hours";
      triggerItem.value = i;
      $scope.trigger.push(triggerItem);
    }
    /*---------------------------------------------------------------------------------------*/

    /* getStatess service*/
    var getStatesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.states = data.response.states;
      }
    };

    $scope.getRespectiveStates = function() {
      $scope.getStates($scope.events.country, getStatesSuccess);
    };

    /*---------------------------------------------------------------------------------------*/
    /* getCities service*/
    var getCitiesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.cities = data.response.cities;
      }
    };

    $scope.getRespectiveCities = function() {
      $scope.getCities($scope.events.state, getCitiesSuccess);
    };

    /*---------------------------------------------------------------------------------------*/
    /*var getPoiCategoriesUrl = appService.generateURL(constants.endpoints.getPoiCategories);

    var getPoiCategoriesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.PoiCategories = data.response;
      }
    };

    appService.getData(getPoiCategoriesUrl).then(getPoiCategoriesSuccess, $scope.serviceErrorHandler);*/

    /*success callback for getPoiTypes service*/
    var getPoiTypesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.pois = data.response.poiType;
      }
    };
    var getPoiTypesUrl = appService.generateURL(constants.endpoints.getPoiTypes);
    appService.getData(getPoiTypesUrl).then(getPoiTypesSuccess, $scope.printServiceError);
    /*---------------------------------------------------------------------------------------*/

    $scope.dateOptions = {
      format: 'yyyy/mm/dd', // ISO formatted date
      onClose: function(e) {
        // do something when the picker closes
      }
    }

    $scope.timeOptions = {
      format: 'HH:i', // ISO formatted date
      onClose: function(e) {
        // do something when the picker closes
      }
    }

    var addEventSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $rootScope.showAlert(data.status.messagem, constants.alertTypes.notification);
      }
    }

    $scope.submitEvent = function($event) {
      var payload = {};
      var date = $scope.events.selectedDate;
      var startDate = date + " " + $scope.events.startTime;
      var endDate = date + " " + $scope.events.endTime;

      payload.name = $scope.events.name;
      payload.poiId = $scope.events.poi;
      payload.startTime = startDate;
      payload.endTime = endDate;
      payload.triggerBefore = $scope.events.selectedTrigger;

      var addEventUrl = appService.generateURL(constants.endpoints.addEvent);
      appService.updateData(addEventUrl, payload).then(addEventSuccess, $scope.serviceErrorHandler);
      /*{
        "name": "eventName",
        "poiId": "1",
        "startTime": "2015/10/10 10:00:00",
        "endTime": "2015/10/10 10:30:00",
        "triggerBefore": "2"
      }*/

      $event.preventDefault();
    };
  });
