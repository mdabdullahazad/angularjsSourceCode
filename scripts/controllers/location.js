/**
 * @ngdoc function
 * @name tourismApp.controller:LocationCtrl
 * @description
 * # LocationCtrl
 * Controller of the tourismApp
 */
angular.module('tourismApp')
  .controller('LocationCtrl', function($scope, $rootScope, appService, constants) {
    'use strict';

    var getPoiTypesUrl = appService.generateURL(constants.endpoints.getPoiTypes);

    $scope.cluster = {
      'country': '',
      'city': '',
      'name': ''
    };

    $scope.ClusterPoi = {
      'country': '',
      'state': '',
      'city': '',
      'cluster': '',
      'poi': ''
    }
	
	$scope.countries = {
	
	};

    /*success callback for getCities service*/
    var getStatesSuccess = function(data, columnIndex) {
      if ($scope.isResponseAvailable(data)) {
        switch (columnIndex) {
          case 11:
            $scope.states = data.response.states;
            break;
          case 12:
            $scope.statesForNewCity = data.response.states;
            break;
          case 2:
            $scope.clusterStates = data.response.states;
            break;
          case 3:
            $scope.poiStates = data.response.states;
            break;
        };
      }
    };

    /*success callback for getCities service*/
    var getCitiesSuccess = function(data, columnIndex) {
      if ($scope.isResponseAvailable(data)) {
        switch (columnIndex) {
          case 1:
            $scope.cities = data.response.cities;
            break;
          case 2:
            $scope.clusterCities = data.response.cities;
            break;
          case 3:
            $scope.poiCities = data.response.cities;
            break;
        };
      }
    };

    /*success callback for getClusters service*/
    var getClustersSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.clusters = data.response.clusters;
      }
    };

    /*success callback for getPoiTypes service*/
    var getPoiTypesSuccess = function(data) {
      if ($scope.isResponseAvailable(data)) {
        $scope.pois = data.response.poiType;
      }
    };

    /*call the service initially to get the list of countries and poi types*/
    $scope.getCountries();
    appService.getData(getPoiTypesUrl).then(getPoiTypesSuccess, $scope.printServiceError);

    /*use this function to get the new country name from UI and pass it on to server for persistence*/
    $scope.addCountry = function($event) {
      var payload = {};
      payload.countryName = $scope.newCountry.name;
      payload.latitude = $scope.newCountry.lat;
      payload.longitude = $scope.newCountry.lng;

      var addCountryUrl = appService.generateURL(constants.endpoints.addCountry);
      appService.updateData(addCountryUrl, payload).then(addCountrySuccess, $scope.serviceErrorHandler);
      $event.preventDefault();
    };

    /*use this function to get the new state name from UI and pass it on to server for persistence*/
    $scope.addState = function($event) {
      if ($scope.countryForState == "") {
        $rootScope.showAlert(constants.alerts.countryMissing, constants.alertTypes.warning);
        return;
      }

      var payload = {};
      payload.stateName = $scope.newState.name;
      payload.latitude = $scope.newState.lat;
      payload.longitude = $scope.newState.lng;
      payload.countryId = $scope.countryforNewState;

      var addStateUrl = appService.generateURL(constants.endpoints.addState);
      appService.updateData(addStateUrl, payload).then(addStateSuccess, $scope.serviceErrorHandler);
      $event.preventDefault();
    };

    /*use this function to get the new city name from UI and pass it on to server for persistence*/
    $scope.addCity = function($event) {
      if ($scope.stateForCity == "") {
        $rootScope.showAlert(constants.alerts.stateMissing, constants.alertTypes.warning);
        return;
      }

      var payload = {};
      payload.stateId = $scope.stateForNewCity;
      payload.cityName = $scope.newCity.name;
      payload.latitude = $scope.newCity.lat;
      payload.longitude = $scope.newCity.lng;

      var addCityUrl = appService.generateURL(constants.endpoints.addCity);
      appService.updateData(addCityUrl, payload).then(addCitySuccess, $scope.serviceErrorHandler);
      $event.preventDefault();
    };

    /*use this function to get the new cluster from UI and pass it on to server for persistence*/
    $scope.addCluster = function($event) {
      var cityMatchFound = false;
      var payload = {};
      payload.cityId = $scope.cluster.city;
      payload.clusterName = $scope.cluster.name;

      angular.forEach($scope.clusterCities, function(data) {
        if (data.id === $scope.cluster.city && !cityMatchFound) {
          payload.latitude = data.latitude;
          payload.longitude = data.longitude;
          cityMatchFound = true;
        }
      });

      var addClusterUrl = appService.generateURL(constants.endpoints.addCluster);
      appService.updateData(addClusterUrl, payload).then(addClusterSuccess, $scope.serviceErrorHandler);
      $event.preventDefault();
    };

    $scope.addPoiToCluster = function($event) {
      var payload = {};
      payload.poId = $scope.ClusterPoi.poi;
      payload.clusterId = $scope.ClusterPoi.cluster;

      var addPoiToClusterUrl = appService.generateURL(constants.endpoints.addPoiToCluster);
      appService.updateData(addPoiToClusterUrl, payload).then(addPoiToClusterSuccess, $scope.serviceErrorHandler);
      $event.preventDefault();
    };

    /*success callback for addCountry service*/
    var addCountrySuccess = function(data) {
      $scope.newCountry = "";
      $rootScope.showAlert(data.status.message, constants.alertTypes.notification);
      if ($scope.countries != null) {
        $scope.countries.push(data.response);
      }
    };

    /*success callback for addState service*/
    var addStateSuccess = function(data) {
      $scope.newState = "";
      $rootScope.showAlert(data.status.message, constants.alertTypes.notification);
      if ($scope.states != null) {
        $scope.states.push(data.response);
      }
    };

    /*success callback for addCity service*/
    var addCitySuccess = function(data) {
      $scope.newCity = "";
      $rootScope.showAlert(data.status.message, constants.alertTypes.notification);
      if ($scope.cities != null) {
        $scope.cities.push(data.response.city);
      }
    };

    /*success callback for addCity service*/
    var addClusterSuccess = function(data) {
      $rootScope.showAlert(data.status.message, constants.alertTypes.notification);
      if ($scope.clusters == null) {
        $scope.clusters = [];
      }
      $scope.clusters.push(data.response);
    };
    
    /*success callback for addCity service*/
    var addPoiToClusterSuccess = function(data) {
      $rootScope.showAlert(data.status.message, constants.alertTypes.notification);
    };

    /*use this method to get states for respective countries. The column index represents the index of the column in UI.*/
    $scope.getRespectiveStates = function(columnIndex) {
      var countryId;

      switch (columnIndex) {
        case 11:
          countryId = $scope.countryforNewState;
          break;
        case 12:
          countryId = $scope.countryforNewCity;
          break;
        case 2:
          countryId = $scope.cluster.country;
          break;
        case 3:
          countryId = $scope.ClusterPoi.country;
          break;
      };

      $scope.getStates(countryId, function(data) {
        getStatesSuccess(data, columnIndex);
      });
    };

    /*use this method to get cities for respective states. The column index represents the index of the column in UI.*/
    $scope.getRespectiveCities = function(columnIndex) {
      var stateId;

      switch (columnIndex) {
        case 1:
          stateId = $scope.stateForNewCity;
          break;
        case 2:
          stateId = $scope.cluster.state;
          break;
        case 3:
          stateId = $scope.ClusterPoi.state;
          break;
      };
      $scope.getCities(stateId, function(data) {
        getCitiesSuccess(data, columnIndex);
      });
    };

    /*use this method to get clusters.*/
    $scope.getRespectiveClusters = function() {
      var getClustersUrl = appService.generateURL(constants.endpoints.getClusterList);
      getClustersUrl += '?cityId=' + $scope.ClusterPoi.city;
      appService.getData(getClustersUrl).then(getClustersSuccess, $scope.serviceErrorHandler);
    };

  });
