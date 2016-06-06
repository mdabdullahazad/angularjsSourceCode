angular.module('tourismApp')
  .constant('constants', {
    'host': 'http://ec2-52-25-13-204.us-west-2.compute.amazonaws.com/travel_planner/dev/api/v1_4/services.php/',
    'endpoints': {
      'login': 'cmsLogin',
      'addCountry': 'addCountry',
      'addState': 'addState',
      'addCity': 'addCity',
      'addCluster': 'addCluster',
      'addPriceRange': 'addPriceRange',
      'addPoi': 'addPoi',
      'addAccommodation': 'addAccommodation',
      'addWaterTaxi': 'addWaterTaxi',
      'addPoiType': 'addPoiType',
      'addPoiCategory': 'addPoiCategory',
      'addTimeslot': 'addTimeslot',
      'addPoiToCluster': 'mapPoiToCluster',
      'addEvent': 'addEvent',
      'registerCmsUser': 'registerCmsUser',
      'removeCountry': 'removeCountry',
      'getCountryList': 'getCountryList',
      'getStateList': 'getStateList',
      'getCityList': 'getCityList',
      'getClusterList': 'getClusterList',
      'getTimeslots': 'getTimeslots',
      'getPoiTypes': 'getPoiTypes',
      'getPoiPriceRanges': 'getPoiPriceRanges',
      'getPoiCategories': 'getPoiCategories',
      'getContactForPoi': 'getContactForPoi',
      'getStarCategory': 'getStarCategory',
      'getRoomTypes': 'getRoomTypes',
    },
    'alerts': {
      'generalError': 'Please try again later',
      'sessionOut': 'Session Expired. Please login to continue.',
      'noData': 'Temporary server error. Please try again later.',
      'loginFailed': 'Login Failed.',
      'fieldsMissing': 'Please fill the mandatory fields',
      'fileMissing': 'Please select a file to upload',
      'uploadSuccess': 'Uploaded Successfully',
      'countryMissing': 'Please select a country',
      'stateMissing': 'Please select a state',
      'hugeFile': 'Sorry, your attachment is too big. Maximum file size allowed: ',
      'uploadPromise': ' data will be submited once the selected images are uploaded successfully',
      'mapsTitle': 'Select your location',
      "rejectedImages": 'Following images cannot be selected. Their dimensions are bigger than expected.'
    },
    'modalTypes': {
      'alert': 'alert',
      'popup': 'popup',
      'tooltip': 'tooltip',
      'map': 'map'
    },
    'alertTypes': {
      'error': 'error',
      'notification': 'notification',
      'warning': 'warning',
      'default': 'default'
    },
    's3Info': {
      'region': 'us-west-2',
      'file_size_limit': 10000000,
      'server_encryption': 'AES256',
      'bucket': 'travelplannermedia',
      'access_key': 'AKIAIVLBURESR3L4JEKA',
      'secret_key': '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',
      'randomString': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    },
    'general': {
      'toastTimeout': 4000,
      'sliderImageWidth': 600,
      'sliderImageHeight': 250,
    }
  });
