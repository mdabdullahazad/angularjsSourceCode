var config = function() {

  /*configure the tabs here. Tell what is the tab name and switch it active or inactive in UI*/
  this.dashboard = {
    "tabs": {
      "count": 6,
      "headers": [{
        "label": "Location",
        "template": "views/location.html",
        "isactive": true
      }, {
        "label": "POI",
        "template": "views/poi.html",
        "isactive": true
      }, {
        "label": "Accommodation",
        "template": "views/accommodation.html",
        "isactive": true
      }, {
        "label": "Water Taxi",
        "template": "views/water_taxi.html",
        "isactive": true
      }, {
        "label": "Events",
        "template": "views/events.html",
        "isactive": true
      }, {
        "label": "Emergency Info",
        "template": "views/emergency_info.html",
        "isactive": false
      },{
        "label": "User",
        "template": "views/user.html",
		 "isactive": true
      }]
    }
  };
  
  return this;
}
