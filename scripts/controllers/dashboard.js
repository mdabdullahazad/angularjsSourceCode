/**
 * @ngdoc function
 * @name tourismApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the tourismApp
 */
angular.module('tourismApp')
  .controller('DashboardCtrl', function($scope) {
    'use strict';

    $scope.tabs = config().dashboard.tabs;
  });
