Controllers.controller('MapController', function($scope, $rootScope, $timeout, $api, $timeout, $transitions) { 

  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "curl" }); };

  $scope.mapdata = null;
  $scope.map = { center: [40.7, -74] };

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
      $scope.map.center = ctr;
      console.log("AND, I GOT HERE");
    }
    var failure = function(why) { console.error("Ah, you failed.  Here's why: ", why); };
    navigator.geolocation.getCurrentPosition(success, failure, { timeout: 30000 });
  };

  $scope.map_setup();
});
