angular
  .module('tourismApp').factory('ngLocalStore', function($rootScope) {
    'use strict';
    return {
      get: function(key) {
        if (this.isLocalStoreSupported()) {
          return localStorage.getItem(key);
        }
        return null;
      },

      save: function(key, data) {
        if (this.isLocalStoreSupported()) {
          return localStorage.setItem(key, JSON.stringify(data));
        }
        return null;
      },

      remove: function(key) {
        if (this.isLocalStoreSupported()) {
          return localStorage.removeItem(key);
        }
        return null;
      },

      clearAll: function() {
        if (this.isLocalStoreSupported()) {
          return localStorage.clear();
        }
        return null;
      },

      isLocalStoreSupported: function() {
        try {
          return window.localStorage !== undefined && window.localStorage !== null;
        } catch (e) {
          return false;
        }
      }
    };
  });

angular
  .module('tourismApp').factory('ngSessionStore', function($rootScope) {
    'use strict';
    return {
      get: function(key) {
        if (this.isSessionStoreSupported()) {
          return sessionStorage.getItem(key);
        }
        return null;
      },

      save: function(key, data) {
        if (this.isSessionStoreSupported()) {
          return sessionStorage.setItem(key, JSON.stringify(data));
        }
        return null;
      },

      remove: function(key) {
        if (this.isSessionStoreSupported()) {
          return sessionStorage.removeItem(key);
        }
        return null;
      },

      clearAll: function() {
        if (this.isSessionStoreSupported()) {
          return sessionStorage.clear();
        }
        return null;
      },

      isSessionStoreSupported: function() {
        try {
          return window.sessionStorage !== undefined && window.sessionStorage !== null;
        } catch (e) {
          return false;
        }
      }
    };
  });
/**
 * @ngdoc service
 * @name tourismApp.AppService
 * @description
 * AppService service acts as the final end point for the Web App to communicate to the Restful api calls.
 *
 * Ref : https://docs.angularjs.org/guide/services
 * # AppData
 */
angular
  .module('tourismApp').factory('appService', ['$http', 'constants', '$q', 'ngSessionStore', '$rootScope',
    function($http, constants, $q, ngSessionStore, $rootScope) {
      'use strict';

      var accessPoint = constants.host,
        deviceData = {};

      //  var requestPromise;
      $http.defaults.useXDomain = true;

      var onSuccess = function(response, requestPromise) {
        requestPromise.resolve(response);
      };

      var onFailure = function(response, status, requestPromise) {
        if (status == 401) {
          var msg = response.status.message;
          msg = msg === undefined ? constants.alerts.sessionOut : msg;
          $rootScope.showAlert(msg, constants.alertTypes.default);
          $rootScope.logoutUser();
          return;
        }
        var responseObj = {};
        responseObj.status = status;
        if ((typeof response).toString() === "object") {
          responseObj.response = response;
          requestPromise.reject(responseObj);
        } else {
          requestPromise.reject(responseObj);
        }
      };

      return {
        getData: function(endpoint) {
          var token = JSON.parse(ngSessionStore.get('userToken'));
          if (token !== undefined && token !== null) {
            $http.defaults.headers.common.UserToken = token;
          }

          var requestPromise = $q.defer();
          $http.get(endpoint).success(function(response, status, headers, constants, statusText) {
            onSuccess(response, requestPromise);
          }).error(function(response, status, headers, constants, statusText) {
            onFailure(response, status, requestPromise);
          });
          return requestPromise.promise;
        },

        postData: function(endpoint, data) {
          var token = JSON.parse(ngSessionStore.get('userToken'));
          if (token !== undefined && token !== null) {
            $http.defaults.headers.common.UserToken = token;
          }

          var requestPromise = $q.defer();
          $http.post(endpoint, data).success(function(response, status, headers, constants, statusText) {
            onSuccess(response, requestPromise);
          }).error(function(response, status, headers, constants, statusText) {
            onFailure(response, status, requestPromise);
          });
          return requestPromise.promise;
        },

        deleteData: function(endpoint) {
          var token = JSON.parse(ngSessionStore.get('userToken'));
          if (token !== undefined && token !== null) {
            $http.defaults.headers.common.UserToken = token;
          }

          var requestPromise = $q.defer();
          $http.delete(endpoint).success(function(response, status, headers, constants, statusText) {
            onSuccess(response, requestPromise);
          }).error(function(response, status, headers, constants, statusText) {
            onFailure(response, status, requestPromise);
          });
          return requestPromise.promise;
        },


        updateData: function(endpoint, data) {
          var token = JSON.parse(ngSessionStore.get('userToken'));
          if (token !== undefined && token !== null) {
            $http.defaults.headers.common.UserToken = token;
          }

          var requestPromise = $q.defer();
          $http.put(endpoint, data).success(function(response, status, headers, constants, statusText) {
            onSuccess(response, requestPromise);
          }).error(function(response, status, headers, constants, statusText) {
            onFailure(response, status, requestPromise);
          });
          return requestPromise.promise;
        },

        generateURL: function(endpoint) {
          var url = accessPoint + endpoint;
          return url;
        },
        getSelectedVersion: function() {
          return deviceData;
        },

        setSelectedVersion: function(deviceName, versionNumb) {
          deviceData = {
            "platformName": deviceName,
            "versionNumb": versionNumb
          };
        },

        clearSelectedVersion: function() {
          deviceData = undefined;
        }
      };
    }
  ]);
