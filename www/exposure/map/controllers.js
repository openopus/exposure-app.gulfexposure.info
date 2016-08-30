Controllers.controller('MapController', function($scope, $rootScope, $timeout, $api, $timeout, $transitions, NgMap) {

  $scope.go_dashboard = function() { $transitions.go("dashboard", { type: "slide", direction: "right" }); };
  $scope.mapdata = null;

  $scope.map_setup = function() {
    var heatmap = document.getElementById("exposure-heatmap");
    var win_height = window.innerHeight;
    var heatmap_top = heatmap.getBoundingClientRect().top;
    angular.element(heatmap).css("min-height",  "" + win_height - heatmap_top + "px");
    google.maps.event.trigger($scope.map, 'resize');

    try {
      $api.get("heatmap").then(function(response) {
        $scope.map_points = response.data;
      });
    } catch(x) {
      console.error("Couldn't talk to the API server in map/controllers.js", x);
    }

    var success = function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var ctr  = new google.maps.LatLng(lat, lng);
    }
    var failure = function(why) { console.error("Ah, you failed.  Here's why: ", why); };
    navigator.geolocation.getCurrentPosition(success, failure, { timeout: 30000 });
  };

  NgMap.getMap("exposure-heatmap").then(function(map) {
    $scope.map = map;
    $scope.map_setup();
  });

});
