/**
 * @ngdoc overview
 * @name tourismApp
 * @description
 * # tourismApp
 *
 * Main module of the application.
 */
angular
  .module('tourismApp', [
    'ngResource',
    'ngRoute',
    'ui.router',
    'ngMaterial',
    'angular-md5',
    'angular-datepicker',
    'uiGmapgoogle-maps'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    'use strict';
    //
    // For any unmatched url, redirect to login
    $urlRouterProvider.otherwise('login');
    //
    // Now set up the states
    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "views/login.html",
        controller: 'LoginCtrl'
      })
      .state('dashboard', {
        url: "/dashboard",
        templateUrl: "views/dashboard.html",
        controller: 'DashboardCtrl'
      })
  })
  .config(function($mdThemingProvider, $httpProvider) {
    'use strict';
    $mdThemingProvider.theme('default')
    /*.primaryPalette('green')
      .accentPalette('orange')*/
    ;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
  });
