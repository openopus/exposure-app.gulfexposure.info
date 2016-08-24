Controllers.controller('MapController', function($scope, $rootScope, $timeout, $api, $timeout, $transitions, NgMap) {

  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "slide", direction: "right" }); };

  $scope.mapdata = null;

  NgMap.getMap("exposure-heatmap").then(function(map) {
    $scope.map = map;
  });

  try {
    // $scope.mapdata = $api.get("heatmap");
  } catch(x) {
    console.error("Couldn't talk to the API server in map/controllers.js", x);
  }

  $scope.map_setup = function() {
    var base = document.getElementsByClassName("heatmap-wrapper");
    var wrapper = angular.element(base);
    wrapper.css({height: "500px"});
    console.log("Okay, the map has been initialized.");
    var success = function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var ctr  = new google.maps.LatLng(lat, lng);
      console.log("AND, I GOT HERE");
    }
    var failure = function(why) { console.error("Ah, you failed.  Here's why: ", why); };
    navigator.geolocation.getCurrentPosition(success, failure, { timeout: 30000 });
  };

  $scope.map_setup();
});
